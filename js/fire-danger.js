(function () {
  const app = document.querySelector('[data-fire-danger-app]');
  if (!app) return;

  const indexSelect = document.getElementById('index-select');
  const dateSelect = document.getElementById('date-select');
  const details = document.getElementById('layer-details');
  const legend = document.getElementById('fire-legend');
  const downloadButton = document.getElementById('download-current');
  const display = window.FireDangerDisplay || {
    formatValue: (value) => value,
    formatRange: (min, max) => `${min} to ${max}`,
    unitsLabel: (dataset) => dataset.units || 'Not provided'
  };

  const palette = ['#2f7bbd', '#6fba5b', '#f0d34c', '#e58235', '#b2182b'];
  let map;
  let rasterLayer;
  let manifest;
  let activeDataset;

  function setDetails(rows) {
    details.innerHTML = rows.map(([label, value]) => `<dt>${label}</dt><dd>${value || 'Not provided'}</dd>`).join('');
  }

  function setLegend(dataset) {
    const min = dataset.min ?? dataset.legend?.min;
    const max = dataset.max ?? dataset.legend?.max;
    const minLabel = min === undefined ? 'Low' : display.formatValue(min, dataset);
    const maxLabel = max === undefined ? 'High' : display.formatValue(max, dataset);
    legend.innerHTML = `
      <strong>${dataset.indexName || dataset.title || 'Fire danger'}</strong>
      <div class="legend-bar" aria-hidden="true"></div>
      <div class="legend-scale"><span>${minLabel}</span><span>${maxLabel}</span></div>
    `;
  }

  function ensureMap() {
    if (map) return map;

    map = L.map('fire-map', {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([35, 105], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 12,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    return map;
  }

  function valueToColor(value, min, max) {
    if (value === null || value === undefined || Number.isNaN(value)) return null;
    if (max === min) return palette[palette.length - 1];
    const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const index = Math.min(palette.length - 1, Math.floor(ratio * palette.length));
    return palette[index];
  }

  function datasetsForIndex(indexId) {
    return manifest.datasets
      .filter((dataset) => dataset.indexId === indexId)
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  }

  function isLeafletCompatibleCrs(dataset) {
    const crs = String(dataset.targetCrs || dataset.crs || '').toUpperCase();
    return crs === 'EPSG:4326' || crs.includes('WGS 84') || crs.includes('WGS84');
  }

  function populateIndices() {
    indexSelect.innerHTML = '';
    manifest.indices.forEach((index) => {
      const option = document.createElement('option');
      option.value = index.id;
      option.textContent = index.name;
      indexSelect.appendChild(option);
    });
  }

  function populateDates() {
    const datasets = datasetsForIndex(indexSelect.value);
    dateSelect.innerHTML = '';

    datasets.forEach((dataset) => {
      const option = document.createElement('option');
      option.value = dataset.id;
      option.textContent = dataset.date || dataset.title || dataset.filename;
      dateSelect.appendChild(option);
    });

    dateSelect.disabled = datasets.length === 0;
    downloadButton.disabled = datasets.length === 0;
    return datasets[0];
  }

  async function loadDataset(dataset) {
    if (!dataset) {
      activeDataset = null;
      setDetails([
        ['Status', 'No GeoTIFF datasets are listed in manifest.json.'],
        ['Next step', 'Add daily .tif files to source/fire-danger-data and run npm run data:update.']
      ]);
      legend.innerHTML = '<strong>No raster loaded</strong><p>Add GeoTIFF data to activate the map.</p>';
      return;
    }

    activeDataset = dataset;
    setDetails([
      ['Status', 'Loading raster...'],
      ['Title', dataset.title],
      ['Date', dataset.date],
      ['File', dataset.filename]
    ]);
    setLegend(dataset);

    try {
      if (!isLeafletCompatibleCrs(dataset)) {
        throw new Error(
          `Raster CRS is ${dataset.crs || dataset.targetCrs || 'unknown'}, but Leaflet display expects EPSG:4326. Run npm run data:update to normalize the GeoTIFF before publishing.`
        );
      }

      const mapInstance = ensureMap();
      const response = await fetch(dataset.file);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const arrayBuffer = await response.arrayBuffer();
      const georaster = await parseGeoraster(arrayBuffer);
      const min = dataset.min ?? georaster.mins?.[0] ?? 0;
      const max = dataset.max ?? georaster.maxs?.[0] ?? 100;
      const noDataValue = dataset.noDataValue ?? georaster.noDataValue;

      if (rasterLayer) {
        mapInstance.removeLayer(rasterLayer);
      }

      rasterLayer = new GeoRasterLayer({
        georaster,
        opacity: 0.72,
        resolution: 192,
        pixelValuesToColorFn: (values) => {
          const value = values[0];
          if (value === noDataValue) return null;
          return valueToColor(value, min, max);
        }
      });
      rasterLayer.addTo(mapInstance);
      mapInstance.fitBounds(rasterLayer.getBounds(), { padding: [18, 18] });

      setDetails([
        ['Title', dataset.title],
        ['Index', dataset.indexName || dataset.indexId],
        ['Date', dataset.date],
        ['Units', display.unitsLabel(dataset)],
        ['Range', display.formatRange(min, max, dataset)],
        ['Version', dataset.version],
        ['Produced', dataset.productionTime],
        ['Source', dataset.source],
        ['Contact', dataset.contact],
        ['Notes', dataset.notes],
        ['File', dataset.filename]
      ]);
    } catch (error) {
      setDetails([
        ['Status', 'The selected GeoTIFF could not be displayed.'],
        ['Reason', error.message],
        ['File', dataset.file],
        ['Hint', 'Use browser-readable GeoTIFF files, confirm the file is copied into source/fire-danger-data, and preview through a local web server rather than opening the HTML file directly.']
      ]);
    }
  }

  function selectedDataset() {
    return manifest.datasets.find((dataset) => dataset.id === dateSelect.value);
  }

  async function initialize() {
    ensureMap();
    setDetails([['Status', 'Loading manifest...']]);

    try {
      const response = await fetch('../fire-danger-data/manifest.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      manifest = await response.json();
      manifest.indices = manifest.indices || [];
      manifest.datasets = manifest.datasets || [];

      populateIndices();
      const firstDataset = populateDates();
      await loadDataset(firstDataset);
    } catch (error) {
      setDetails([
        ['Status', 'Could not load manifest.json.'],
        ['Reason', error.message]
      ]);
      legend.innerHTML = '<strong>Data unavailable</strong>';
    }
  }

  indexSelect.addEventListener('change', async () => {
    const firstDataset = populateDates();
    await loadDataset(firstDataset);
  });

  dateSelect.addEventListener('change', async () => {
    await loadDataset(selectedDataset());
  });

  downloadButton.addEventListener('click', () => {
    if (!activeDataset) return;
    window.location.href = activeDataset.file;
  });

  initialize();
})();

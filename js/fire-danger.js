(function () {
  const app = document.querySelector('[data-fire-danger-app]');
  if (!app) return;

  const indexSelect = document.getElementById('index-select');
  const dateSelect = document.getElementById('date-select');
  const basemapSelect = document.getElementById('basemap-select');
  const colorRampSelect = document.getElementById('color-ramp-select');
  const details = document.getElementById('layer-details');
  const legend = document.getElementById('fire-legend');
  const downloadButton = document.getElementById('download-current');
  const downloadSelectedButton = document.getElementById('download-selected');
  const datasetSearch = document.getElementById('dataset-search');
  const datasetChecklist = document.getElementById('dataset-checklist');
  const selectAllDatasets = document.getElementById('select-all-datasets');
  const dashboardSummary = document.getElementById('dashboard-summary');
  const availabilityChart = document.getElementById('availability-chart');
  const rangeChart = document.getElementById('range-chart');
  const display = window.FireDangerDisplay || {
    formatValue: (value) => value,
    formatRange: (min, max) => `${min} to ${max}`,
    unitsLabel: (dataset) => dataset.units || 'Not provided'
  };

  const colorRamps = [
    {
      id: 'fire',
      label: 'Fire Danger',
      colors: ['#2f7bbd', '#6fba5b', '#f0d34c', '#e58235', '#b2182b']
    },
    {
      id: 'ember',
      label: 'Ember',
      colors: ['#fff7bc', '#fec44f', '#fe9929', '#d95f0e', '#8c2d04']
    },
    {
      id: 'viridis',
      label: 'Viridis',
      colors: ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725']
    },
    {
      id: 'magma',
      label: 'Magma',
      colors: ['#000004', '#3b0f70', '#8c2981', '#de4968', '#fe9f6d', '#fcfdbf']
    },
    {
      id: 'inferno',
      label: 'Inferno',
      colors: ['#000004', '#420a68', '#932667', '#dd513a', '#fca50a', '#fcffa4']
    },
    {
      id: 'cividis',
      label: 'Cividis',
      colors: ['#00204d', '#31446b', '#666870', '#958f78', '#c8bb73', '#ffea46']
    },
    {
      id: 'terrain',
      label: 'Terrain',
      colors: ['#204a87', '#4f8f6b', '#b8d96f', '#f3d06b', '#b36b3c', '#f5f1df']
    },
    {
      id: 'spectral',
      label: 'Spectral',
      colors: ['#5e4fa2', '#3288bd', '#66c2a5', '#abdda4', '#fee08b', '#f46d43', '#9e0142']
    },
    {
      id: 'thermal',
      label: 'Thermal',
      colors: ['#081d58', '#253494', '#225ea8', '#1d91c0', '#41b6c4', '#c7e9b4', '#ffffcc']
    },
    {
      id: 'mono',
      label: 'Single Hue',
      colors: ['#edf8fb', '#b3cde3', '#8c96c6', '#8856a7', '#810f7c']
    }
  ];
  const basemaps = [
    {
      id: 'osm',
      label: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: {
        maxZoom: 12,
        attribution: '&copy; OpenStreetMap contributors'
      }
    },
    {
      id: 'light',
      label: 'Light Cartographic',
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      options: {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }
    },
    {
      id: 'imagery',
      label: 'Satellite Imagery',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      options: {
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri'
      }
    },
    {
      id: 'dark',
      label: 'Dark Cartographic',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      options: {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }
    }
  ];
  let map;
  let baseLayer;
  let rasterLayer;
  let manifest;
  let manifestUrl;
  let activeDataset;
  let activeGeoraster;
  let activeNoDataValue;
  let activeMin;
  let activeMax;
  let pendingRasterFrame;

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setDetails(rows) {
    details.innerHTML = rows
      .map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || 'Not provided')}</dd>`)
      .join('');
  }

  function setLegend(dataset) {
    const min = dataset.min ?? dataset.legend?.min;
    const max = dataset.max ?? dataset.legend?.max;
    const minLabel = min === undefined ? 'Low' : display.formatValue(min, dataset);
    const maxLabel = max === undefined ? 'High' : display.formatValue(max, dataset);
    const ramp = selectedColorRamp();
    legend.innerHTML = `
      <strong>${escapeHtml(dataset.indexName || dataset.title || 'Fire danger')}</strong>
      <div class="legend-bar" style="--legend-gradient: ${escapeHtml(rampGradient(ramp.colors))}" aria-hidden="true"></div>
      <div class="legend-scale"><span>${escapeHtml(minLabel)}</span><span>${escapeHtml(maxLabel)}</span></div>
    `;
  }

  function ensureMap() {
    if (map) return map;

    map = L.map('fire-map', {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([39, -98], 4);

    setBasemap(basemapSelect.value || basemaps[0].id);

    return map;
  }

  function populateBasemapOptions() {
    basemapSelect.innerHTML = basemaps.map((basemap) => (
      `<option value="${escapeHtml(basemap.id)}">${escapeHtml(basemap.label)}</option>`
    )).join('');
    basemapSelect.value = basemaps[0].id;
  }

  function populateColorRampOptions() {
    colorRampSelect.innerHTML = colorRamps.map((ramp) => (
      `<option value="${escapeHtml(ramp.id)}">${escapeHtml(ramp.label)}</option>`
    )).join('');
    colorRampSelect.value = colorRamps[0].id;
  }

  function selectedColorRamp() {
    return colorRamps.find((ramp) => ramp.id === colorRampSelect.value) || colorRamps[0];
  }

  function rampGradient(colors) {
    return `linear-gradient(90deg, ${colors.join(', ')})`;
  }

  function setColorRamp(rampId) {
    colorRampSelect.value = colorRamps.some((ramp) => ramp.id === rampId) ? rampId : colorRamps[0].id;
    if (activeDataset) {
      setLegend(activeDataset);
      renderRangeChart(activeDataset);
    }
    if (activeGeoraster) {
      scheduleRasterRender(activeGeoraster, activeDataset, activeMin, activeMax, activeNoDataValue, { fitBounds: false });
    }
  }

  function setBasemap(basemapId) {
    if (!map) return;
    const selected = basemaps.find((basemap) => basemap.id === basemapId) || basemaps[0];
    if (baseLayer) {
      map.removeLayer(baseLayer);
    }
    baseLayer = L.tileLayer(selected.url, selected.options);
    baseLayer.addTo(map);
    if (rasterLayer) {
      rasterLayer.bringToFront();
    }
  }

  function valueToColor(value, min, max) {
    if (value === null || value === undefined || Number.isNaN(value)) return null;
    const palette = selectedColorRamp().colors;
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

  function filteredDatasets() {
    const query = datasetSearch.value.trim().toLowerCase();
    const datasets = datasetsForIndex(indexSelect.value);
    if (!query) return datasets;

    return datasets.filter((dataset) => {
      const searchable = [
        dataset.id,
        dataset.indexId,
        dataset.indexName,
        dataset.title,
        dataset.date,
        dataset.filename,
        dataset.version
      ].join(' ').toLowerCase();
      return searchable.includes(query);
    });
  }

  function isLeafletCompatibleCrs(dataset) {
    const crs = String(dataset.targetCrs || dataset.crs || '').toUpperCase();
    return crs === 'EPSG:4326' || crs.includes('WGS 84') || crs.includes('WGS84');
  }

  function datasetFileUrl(dataset) {
    if (!dataset) return '';
    if (/^https?:\/\//i.test(dataset.file || '')) return dataset.file;
    if (dataset.filename) return new URL(dataset.filename, manifestUrl).toString();
    if (!dataset.file) return '';
    const filePath = String(dataset.file).replace(/^\/?fire-danger-data\//, '');
    return new URL(filePath, manifestUrl).toString();
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
    const datasets = filteredDatasets();
    dateSelect.innerHTML = '';

    datasets.forEach((dataset) => {
      const option = document.createElement('option');
      option.value = dataset.id;
      option.textContent = dataset.date || dataset.title || dataset.filename;
      dateSelect.appendChild(option);
    });

    const disabled = datasets.length === 0;
    dateSelect.disabled = disabled;
    downloadButton.disabled = disabled;
    downloadSelectedButton.disabled = disabled;
    selectAllDatasets.disabled = disabled;
    populateDownloadChecklist(datasets);
    return datasets[0];
  }

  function populateDownloadChecklist(datasets) {
    if (!datasets.length) {
      datasetChecklist.innerHTML = '<p class="empty-state">No files match the current filters.</p>';
      selectAllDatasets.checked = false;
      return;
    }

    datasetChecklist.innerHTML = datasets.map((dataset) => `
      <label class="dataset-option">
        <input type="checkbox" value="${escapeHtml(dataset.id)}">
        <span>
          <strong>${escapeHtml(dataset.date || dataset.id)}</strong>
          <small>${escapeHtml(dataset.indexName || dataset.indexId)} - ${escapeHtml(dataset.filename)}</small>
        </span>
      </label>
    `).join('');
    selectAllDatasets.checked = false;
  }

  function updateDashboardSummary() {
    const datasets = manifest.datasets || [];
    const products = new Set(datasets.map((dataset) => dataset.indexId)).size;
    const latestDate = datasets
      .map((dataset) => dataset.date)
      .filter(Boolean)
      .sort()
      .pop();
    const crsValues = Array.from(new Set(datasets.map((dataset) => dataset.targetCrs || dataset.crs).filter(Boolean)));
    const crs = crsValues.length === 1 ? crsValues[0] : `${crsValues.length || 0} CRS`;

    dashboardSummary.innerHTML = [
      ['Products', products],
      ['Layers', datasets.length],
      ['Latest Date', latestDate || 'Not provided'],
      ['CRS', crs || 'Not provided']
    ].map(([label, value]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join('');
  }

  function renderAvailabilityChart() {
    const counts = manifest.indices.map((index) => ({
      id: index.id,
      name: index.name,
      count: manifest.datasets.filter((dataset) => dataset.indexId === index.id).length
    }));
    const maxCount = Math.max(1, ...counts.map((item) => item.count));

    availabilityChart.innerHTML = counts.map((item) => {
      const width = Math.max(4, Math.round((item.count / maxCount) * 100));
      return `
        <div class="bar-row">
          <span>${escapeHtml(item.id)}</span>
          <div class="bar-track"><i style="width: ${width}%"></i></div>
          <strong>${item.count}</strong>
        </div>
      `;
    }).join('');
  }

  function renderRangeChart(dataset) {
    if (!dataset) {
      rangeChart.innerHTML = '<p class="empty-state">Select a layer to view range statistics.</p>';
      return;
    }

    const min = dataset.min ?? dataset.legend?.min;
    const max = dataset.max ?? dataset.legend?.max;
    const width = dataset.width && dataset.height ? `${dataset.width} x ${dataset.height}` : 'Not provided';

    rangeChart.innerHTML = `
      <div class="range-scale">
        <span>${escapeHtml(min === undefined ? 'Low' : display.formatValue(min, dataset))}</span>
        <div class="legend-bar" style="--legend-gradient: ${escapeHtml(rampGradient(selectedColorRamp().colors))}" aria-hidden="true"></div>
        <span>${escapeHtml(max === undefined ? 'High' : display.formatValue(max, dataset))}</span>
      </div>
      <dl>
        <dt>Units</dt><dd>${escapeHtml(display.unitsLabel(dataset))}</dd>
        <dt>Raster size</dt><dd>${escapeHtml(width)}</dd>
        <dt>Resolution</dt><dd>${escapeHtml(Array.isArray(dataset.resolution) ? dataset.resolution.join(' x ') : 'Not provided')}</dd>
      </dl>
    `;
  }

  function scheduleRasterRender(georaster, dataset, min, max, noDataValue, options = {}) {
    if (pendingRasterFrame) {
      window.cancelAnimationFrame(pendingRasterFrame);
    }

    pendingRasterFrame = window.requestAnimationFrame(() => {
      pendingRasterFrame = null;
      renderRasterLayer(georaster, dataset, min, max, noDataValue, options);
    });
  }

  function renderRasterLayer(georaster, dataset, min, max, noDataValue, { fitBounds = true } = {}) {
    const mapInstance = ensureMap();
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
    rasterLayer.bringToFront();
    if (fitBounds) {
      mapInstance.fitBounds(rasterLayer.getBounds(), { padding: [18, 18] });
    }
  }

  async function loadDataset(dataset) {
    if (!dataset) {
      activeDataset = null;
      setDetails([
        ['Status', 'No GeoTIFF datasets are listed in manifest.json.'],
        ['Next step', 'Add daily .tif files to source/fire-danger-data and run npm run data:update.']
      ]);
      legend.innerHTML = '<strong>No raster loaded</strong><p>Add GeoTIFF data to activate the map.</p>';
      renderRangeChart(null);
      activeGeoraster = null;
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
    renderRangeChart(dataset);

    try {
      if (!isLeafletCompatibleCrs(dataset)) {
        throw new Error(
          `Raster CRS is ${dataset.crs || dataset.targetCrs || 'unknown'}, but Leaflet display expects EPSG:4326. Run npm run data:update to normalize the GeoTIFF before publishing.`
        );
      }

      const fileUrl = datasetFileUrl(dataset);
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const arrayBuffer = await response.arrayBuffer();
      const georaster = await parseGeoraster(arrayBuffer);
      const min = dataset.min ?? georaster.mins?.[0] ?? 0;
      const max = dataset.max ?? georaster.maxs?.[0] ?? 100;
      const noDataValue = dataset.noDataValue ?? georaster.noDataValue;
      activeGeoraster = georaster;
      activeNoDataValue = noDataValue;
      activeMin = min;
      activeMax = max;
      scheduleRasterRender(georaster, dataset, min, max, noDataValue, { fitBounds: true });

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
        ['File', datasetFileUrl(dataset) || dataset.file],
        ['Hint', 'Confirm the file is copied into source/fire-danger-data and preview the page through the site server so GeoTIFF files are served from the same published directory.']
      ]);
    }
  }

  function selectedDataset() {
    return manifest.datasets.find((dataset) => dataset.id === dateSelect.value);
  }

  function downloadDataset(dataset) {
    const fileUrl = datasetFileUrl(dataset);
    if (!fileUrl) return;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = dataset.filename || '';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function downloadSelectedDatasets() {
    const selectedIds = Array.from(datasetChecklist.querySelectorAll('input[type="checkbox"]:checked'))
      .map((input) => input.value);
    const datasets = manifest.datasets.filter((dataset) => selectedIds.includes(dataset.id));
    datasets.forEach((dataset, index) => {
      window.setTimeout(() => downloadDataset(dataset), index * 250);
    });
  }

  async function initialize() {
    ensureMap();
    setDetails([['Status', 'Loading manifest...']]);

    try {
      manifestUrl = new URL('../fire-danger-data/manifest.json', window.location.href);
      const response = await fetch(manifestUrl, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      manifest = await response.json();
      manifest.indices = manifest.indices || [];
      manifest.datasets = manifest.datasets || [];

      populateIndices();
      populateBasemapOptions();
      populateColorRampOptions();
      updateDashboardSummary();
      renderAvailabilityChart();
      const firstDataset = populateDates();
      await loadDataset(firstDataset);
    } catch (error) {
      setDetails([
        ['Status', 'Could not load manifest.json.'],
        ['Reason', error.message]
      ]);
      legend.innerHTML = '<strong>Data unavailable</strong>';
      dashboardSummary.innerHTML = '<article><span>Status</span><strong>Unavailable</strong></article>';
      availabilityChart.innerHTML = '<p class="empty-state">Manifest unavailable.</p>';
      renderRangeChart(null);
    }
  }

  indexSelect.addEventListener('change', async () => {
    datasetSearch.value = '';
    const firstDataset = populateDates();
    await loadDataset(firstDataset);
  });

  dateSelect.addEventListener('change', async () => {
    await loadDataset(selectedDataset());
  });

  basemapSelect.addEventListener('change', () => {
    setBasemap(basemapSelect.value);
  });

  colorRampSelect.addEventListener('change', () => {
    setColorRamp(colorRampSelect.value);
  });

  datasetSearch.addEventListener('input', async () => {
    const firstDataset = populateDates();
    await loadDataset(firstDataset);
  });

  selectAllDatasets.addEventListener('change', () => {
    datasetChecklist.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.checked = selectAllDatasets.checked;
    });
  });

  downloadButton.addEventListener('click', () => {
    if (!activeDataset) return;
    downloadDataset(activeDataset);
  });

  downloadSelectedButton.addEventListener('click', downloadSelectedDatasets);

  initialize();
})();

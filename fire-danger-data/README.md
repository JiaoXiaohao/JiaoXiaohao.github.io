# Prepared Fire Danger Data Folder

This folder stores website-ready fire danger rasters and metadata. Hexo copies these files into the generated static site and serves them from:

```text
/fire-danger-data/
```

Normal workflow:

```text
raw/*.tif
  -> npm run data:update
  -> source/fire-danger-data/*.tif
  -> source/fire-danger-data/*.json
  -> source/fire-danger-data/manifest.json
```

Use `raw/` for new source rasters. Use this folder for prepared outputs that the website map can read.

## Files In This Folder

- `*.tif`: website-ready GeoTIFF rasters, normalized to a Leaflet-compatible coordinate system.
- `*.json`: sidecar metadata for each raster.
- `manifest.json`: runtime dataset index read by the Fire Danger Index page.
- `metadata-template.json`: example metadata fields for maintainers.

Do not rename `manifest.json`; the public map page loads it at runtime.

## Updating Data

From the project root:

```bash
npm run data:update
npm run build
```

For stricter production validation:

```bash
npm run data:update:strict
npm run build
```

See `docs/FIRE_DANGER_DATA.md` for sidecar JSON, CRS, units, display rules, and troubleshooting details.

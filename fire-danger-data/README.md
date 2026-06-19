# Fire Danger Data Folder

Put daily GeoTIFF files in this folder. The files will be copied into the generated static site and served from `/fire-danger-data/`.

Recommended filenames:

```text
BI_2026-06-12.tif
FWI_2026-06-12.tif
WFL_2026-06-12.tif
ERC_2026-06-12.tif
SC_2026-06-12.tif
```

Optional sidecar metadata can use the same base name:

```text
BI_2026-06-12.json
```

Use `metadata-template.json` as a starting point for sidecar files.

Then run:

```bash
npm run data:update
npm run build
```

Do not rename `manifest.json`; it is read by the public map page.

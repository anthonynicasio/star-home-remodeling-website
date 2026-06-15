# Client image files

Save images from chat into this folder using **exact** filenames (lowercase, hyphens). Then run:

```bash
python scripts/integrate_client_assets.py
npm run build
```

## Required files

| Filename | Use on site |
|----------|-------------|
| `logo.png` | Header, footer, favicon (StarHRC: black house outline, gold star, serif wordmark) |
| `hero-home.jpg` | Homepage hero background |
| `roofing-completed.jpg` | Roofing service & gallery |
| `roofing-install.jpg` | Roofing showcase & gallery |
| `windows-double-hung.jpg` | Windows service & gallery |
| `windows-brick.jpg` | Windows gallery |
| `windows-garden.jpg` | Windows gallery |
| `windows-install.jpg` | Windows showcase & gallery |
| `windows-provia.jpg` | Windows gallery |
| `doors-entry.jpg` | Doors service & gallery |
| `doors-sliding.jpg` | Doors showcase & gallery |
| `siding-bay.jpg` | Siding service & gallery |
| `siding-upper.jpg` | Siding showcase & gallery |
| `remodeling-bath.jpg` | Remodeling service & gallery |
| `remodeling-interior.jpg` | Remodeling showcase & gallery |

## Tips

- Prefer JPG for photos (quality ~85%). Use PNG for the logo if it has transparency.
- Do not rename files after saving; the integration script matches these names exactly.
- Until files are added, the site uses SVG placeholders and still builds successfully.

# Jose & Fynee Wedding Photo Upload

This is a GitHub Pages frontend for a wedding guest photo-upload page.

## Files

- `index.html` — page structure
- `style.css` — design
- `script.js` — file selection and upload logic

## Important

GitHub Pages can host the page, but it cannot receive uploaded files by itself.

For actual uploads, connect `script.js` to a Google Apps Script Web App that saves the uploaded files to a Google Drive folder.

The page currently accepts:

- JPG
- PNG
- WebP
- MP4
- MOV/QuickTime

The current maximum per file is 50 MB. You can change `MAX_FILE_SIZE_MB` in `script.js`.

## GitHub Pages setup

1. Create a GitHub repository, e.g. `wedding-photo-upload`.
2. Upload all three files.
3. In GitHub, open **Settings → Pages**.
4. Set the source to your `main` branch and `/ (root)`.
5. GitHub will give you a URL similar to:
   `https://YOUR-USERNAME.github.io/wedding-photo-upload/`
6. Put that URL into a QR-code generator.
7. Print the QR code on your wedding tables/signage.

## Recommended guest flow

Scan QR → upload photos/videos → enter optional name → Add to album.

No account or app is required.

## Next step

Set up the Google Apps Script backend and paste its Web App URL into:

`GOOGLE_APPS_SCRIPT_URL`

inside `script.js`.

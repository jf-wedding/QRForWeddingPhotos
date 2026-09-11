/*
  Jose & Fynee Wedding Photo Upload
  ---------------------------------
  1. Deploy your Google Apps Script web app.
  2. Paste its URL into GOOGLE_APPS_SCRIPT_URL below.
  3. If the URL is empty, the page runs in DEMO MODE and does not upload files.
*/

const GOOGLE_APPS_SCRIPT_URL = ""; // Example: https://script.google.com/macros/s/XXXX/exec

const MAX_FILE_SIZE_MB = 50;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime"
];

const fileInput = document.getElementById("fileInput");
const chooseBtn = document.getElementById("chooseBtn");
const submitBtn = document.getElementById("submitBtn");
const guestName = document.getElementById("guestName");
const fileList = document.getElementById("fileList");
const statusEl = document.getElementById("status");
const progressWrap = document.getElementById("progressWrap");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const success = document.getElementById("success");
const addMoreBtn = document.getElementById("addMoreBtn");

let selectedFiles = [];

chooseBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  selectedFiles = [...fileInput.files];
  validateAndRender();
});

addMoreBtn.addEventListener("click", () => {
  success.hidden = true;
  fileInput.value = "";
  selectedFiles = [];
  fileList.hidden = true;
  submitBtn.disabled = true;
  statusEl.textContent = "";
});

function validateAndRender() {
  const problems = [];

  for (const file of selectedFiles) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      problems.push(`${file.name}: unsupported file type`);
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      problems.push(`${file.name}: larger than ${MAX_FILE_SIZE_MB} MB`);
    }
  }

  if (problems.length) {
    statusEl.textContent = problems.join(" • ");
    submitBtn.disabled = true;
    renderFileList();
    return;
  }

  statusEl.textContent = "";
  submitBtn.disabled = selectedFiles.length === 0;
  renderFileList();
}

function renderFileList() {
  if (!selectedFiles.length) {
    fileList.hidden = true;
    fileList.innerHTML = "";
    return;
  }

  fileList.hidden = false;
  fileList.innerHTML = selectedFiles.map(file => `
    <div class="file-row">
      <span class="file-name">${escapeHtml(file.name)}</span>
      <span class="file-size">${formatBytes(file.size)}</span>
    </div>
  `).join("");
}

submitBtn.addEventListener("click", uploadFiles);

async function uploadFiles() {
  if (!selectedFiles.length) return;

  if (!GOOGLE_APPS_SCRIPT_URL) {
    statusEl.textContent =
      "Demo mode: connect your Google Apps Script URL in script.js before uploading.";
    return;
  }

  submitBtn.disabled = true;
  chooseBtn.disabled = true;
  progressWrap.hidden = false;
  progressBar.style.width = "5%";
  progressText.textContent = "Preparing your memories…";

  try {
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      progressText.textContent =
        `Uploading ${i + 1} of ${selectedFiles.length}…`;

      const base64 = await fileToBase64(file);

      const payload = {
        guestName: guestName.value.trim() || "Anonymous guest",
        fileName: file.name,
        mimeType: file.type,
        fileData: base64,
        uploadedAt: new Date().toISOString()
      };

      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      progressBar.style.width =
        `${Math.round(((i + 1) / selectedFiles.length) * 100)}%`;
    }

    progressText.textContent = "All done!";
    statusEl.textContent = "";
    fileList.hidden = true;
    submitBtn.hidden = true;
    chooseBtn.hidden = true;
    guestName.disabled = true;
    success.hidden = false;

  } catch (error) {
    console.error(error);
    statusEl.textContent =
      "Something went wrong. Please try again or ask the coordinator for help.";
    submitBtn.disabled = false;
    chooseBtn.disabled = false;
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      // Remove "data:image/jpeg;base64," / similar prefix.
      const result = String(reader.result);
      resolve(result.substring(result.indexOf(",") + 1));
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

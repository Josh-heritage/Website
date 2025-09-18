const MAX_DIM = 800;

const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const gridSizeInput = document.getElementById("gridSize");
const gridValue = document.getElementById("gridValue");
const depthInput = document.getElementById("colorDepth");
const depthValue = document.getElementById("depthValue");
const toggleGridBtn = document.getElementById("toggleGrid");
const downloadBtn = document.getElementById("download");

let img = new Image();
let scaledCanvas = null;
let scaledWidth = 0,
  scaledHeight = 0;
let showGrid = true;

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    img = new Image();
    img.onload = onImageLoad;
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

function onImageLoad() {
  const scale = Math.min(MAX_DIM / img.width, MAX_DIM / img.height, 1);
  scaledWidth = Math.round(img.width * scale);
  scaledHeight = Math.round(img.height * scale);

  scaledCanvas = document.createElement("canvas");
  scaledCanvas.width = scaledWidth;
  scaledCanvas.height = scaledHeight;
  const sctx = scaledCanvas.getContext("2d");
  sctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

  canvas.width = scaledWidth;
  canvas.height = scaledHeight;

  render();
}

function render() {
  if (!scaledCanvas) return;

  const block = parseInt(gridSizeInput.value, 10);
  const levels = parseInt(depthInput.value, 10);

  gridValue.textContent = block;
  depthValue.textContent = levels;


  const cols = Math.ceil(scaledWidth / block);
  const rows = Math.ceil(scaledHeight / block);


  const temp = document.createElement("canvas");
  temp.width = cols;
  temp.height = rows;
  const tctx = temp.getContext("2d");
  tctx.drawImage(scaledCanvas, 0, 0, cols, rows);











  const imgData = tctx.getImageData(0, 0, cols, rows);
  function quantizeToPalette(imgData, levels, iterations = 8) {
    const data = imgData.data;
    const pixels = [];
  

    for (let i = 0; i < data.length; i += 4) {
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }
  

    let palette = [];
    for (let i = 0; i < levels; i++) {
      palette.push(pixels[Math.floor(Math.random() * pixels.length)]);
    }
  
 
    for (let iter = 0; iter < iterations; iter++) {
      let clusters = Array.from({ length: levels }, () => []);

      for (let p of pixels) {
        let best = 0, bestDist = Infinity;
        for (let j = 0; j < levels; j++) {
          let [r, g, b] = palette[j];
          let d = (p[0] - r) ** 2 + (p[1] - g) ** 2 + (p[2] - b) ** 2;
          if (d < bestDist) {
            bestDist = d;
            best = j;
          }
        }
        clusters[best].push(p);
      }
  

      for (let j = 0; j < levels; j++) {
        if (clusters[j].length > 0) {
          let sumR = 0, sumG = 0, sumB = 0;
          for (let [r, g, b] of clusters[j]) {
            sumR += r; sumG += g; sumB += b;
          }
          palette[j] = [
            sumR / clusters[j].length,
            sumG / clusters[j].length,
            sumB / clusters[j].length
          ];
        }
      }
    }
  

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i], g = data[i + 1], b = data[i + 2];
  
      let best = 0, bestDist = Infinity;
      for (let j = 0; j < levels; j++) {
        let [pr, pg, pb] = palette[j];
        let d = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
        if (d < bestDist) {
          bestDist = d;
          best = j;
        }
      }
  
      let [pr, pg, pb] = palette[best];
      data[i]     = Math.round(pr);
      data[i + 1] = Math.round(pg);
      data[i + 2] = Math.round(pb);
    }
  
    return imgData;
  }

const reduced = quantizeToPalette(imgData, levels);
tctx.putImageData(reduced, 0, 0);













  // clear and redraw as perfect blocks
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const data = reduced.data; // use reduced instead of imgData
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const idx = (y * cols + x) * 4;
      ctx.fillStyle = `rgb(${data[idx]},${data[idx + 1]},${data[idx + 2]})`;
      ctx.fillRect(x * block, y * block, block, block);
    }
  }

  // draw grid if enabled
  if (showGrid) {
    ctx.strokeStyle = "rgba(0,0,0,0.6)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * block + 0.5, 0);
      ctx.lineTo(x * block + 0.5, rows * block);
      ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * block + 0.5);
      ctx.lineTo(cols * block, y * block + 0.5);
      ctx.stroke();
    }
  }
}

gridSizeInput.addEventListener("input", render);
depthInput.addEventListener("input", render);

toggleGridBtn.addEventListener("click", () => {
  showGrid = !showGrid;
  render();
});

downloadBtn.addEventListener("click", () => {
  if (!scaledCanvas) return;
  const link = document.createElement("a");
  link.download = "cross-stitch-pattern.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
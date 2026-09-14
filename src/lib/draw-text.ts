const FILL = "#e8ffe8";

export function drawFilledText(
  width: number,
  height: number,
  text: string,
  fill = FILL,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(width));
  canvas.height = Math.max(1, Math.floor(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.fillStyle = fill;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const maxWidth = canvas.width * 0.88;
  let size = Math.min(canvas.height * 0.32, 64);
  ctx.font = `600 ${size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  while (size > 10 && ctx.measureText(text).width > maxWidth) {
    size -= 1;
    ctx.font = `600 ${size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  }
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  return canvas;
}

export function drawPadlock(width: number, height: number, fill = FILL) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(width));
  canvas.height = Math.max(1, Math.floor(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2 + canvas.height * 0.06;
  const bodyW = Math.min(canvas.width, canvas.height) * 0.32;
  const bodyH = bodyW * 0.86;

  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(cx - bodyW / 2, cy - bodyH * 0.15, bodyW, bodyH, 10);
  ctx.fill();

  ctx.strokeStyle = fill;
  ctx.lineWidth = Math.max(7, bodyW * 0.16);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, cy - bodyH * 0.15, bodyW * 0.28, Math.PI, 0);
  ctx.stroke();

  ctx.fillStyle = "#050805";
  ctx.beginPath();
  ctx.arc(cx, cy + bodyH * 0.18, bodyW * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(cx - bodyW * 0.04, cy + bodyH * 0.18, bodyW * 0.08, bodyH * 0.22);
  return canvas;
}

export function drawTrophy(width: number, height: number, fill = FILL) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(width));
  canvas.height = Math.max(1, Math.floor(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2 - canvas.height * 0.04;
  const scale = Math.min(canvas.width, canvas.height);
  const cupW = scale * 0.22;
  const cupH = scale * 0.2;

  ctx.fillStyle = fill;
  ctx.strokeStyle = fill;
  ctx.lineWidth = Math.max(5, scale * 0.035);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(cx - cupW, cy - cupH * 0.35);
  ctx.lineTo(cx - cupW * 0.7, cy + cupH * 0.55);
  ctx.quadraticCurveTo(cx, cy + cupH * 0.85, cx + cupW * 0.7, cy + cupH * 0.55);
  ctx.lineTo(cx + cupW, cy - cupH * 0.35);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx - cupW * 1.15, cy - cupH * 0.05, cupW * 0.38, Math.PI * 0.15, Math.PI * 1.15);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + cupW * 1.15, cy - cupH * 0.05, cupW * 0.38, -Math.PI * 0.15, Math.PI * 0.85, true);
  ctx.stroke();

  ctx.fillRect(cx - scale * 0.025, cy + cupH * 0.55, scale * 0.05, scale * 0.12);
  ctx.beginPath();
  ctx.roundRect(cx - scale * 0.1, cy + cupH * 0.55 + scale * 0.12, scale * 0.2, scale * 0.04, 3);
  ctx.fill();

  ctx.font = `600 ${Math.max(11, scale * 0.07)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("5/5", cx, cy + cupH * 0.55 + scale * 0.18);

  return canvas;
}

export function paintDots(
  dest: HTMLCanvasElement,
  source: HTMLCanvasElement,
  stride = 5,
  color = FILL,
) {
  const ctx = dest.getContext("2d");
  const srcCtx = source.getContext("2d");
  if (!ctx || !srcCtx) return;

  const { data } = srcCtx.getImageData(0, 0, source.width, source.height);
  ctx.clearRect(0, 0, dest.width, dest.height);
  ctx.fillStyle = color;

  for (let y = 0; y < source.height; y += stride) {
    for (let x = 0; x < source.width; x += stride) {
      const i = (y * source.width + x) * 4;
      const r = data[i] ?? 0;
      const g = data[i + 1] ?? 0;
      const b = data[i + 2] ?? 0;
      const a = data[i + 3] ?? 0;
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      if (a > 16 && luma > 85) {
        ctx.beginPath();
        ctx.arc(x, y, 1.15, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

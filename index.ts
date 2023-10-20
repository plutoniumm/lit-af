import QRCode from 'qrcode';

class Channel {
  name: 'r' | 'g' | 'b';
  values: Array<Uint8Array>;

  constructor(name: string, values: number[][] | string) {
    const allowed = ['r', 'g', 'b'];
    if (allowed.indexOf(name) === -1) {
      throw new Error('Invalid channel name');
    } else {
      this.name = name as 'r' | 'g' | 'b';
    }

    if (typeof values === 'string') {
      values = this.strToMat(values);
    };
    if (values.length > 0 && values[0].length > 0) {
      this.values = values.map((value) => new Uint8Array(value));
    }
  }

  strToMat (str: string) {
    const qr = QRCode.create(str, {
      version: 10,
      errorCorrectionLevel: 'H',
    });
    const w = qr.modules.size;

    const qrmatrix: number[][] = [];
    for (let i = 0; i < w; i++) {
      const row: number[] = [];
      for (let j = 0; j < w; j++) {
        row.push(qr.modules.data[i * w + j]);
      }
      qrmatrix.push(row);
    }

    return qrmatrix;
  }

  matToRGB (channels: Channel[]) {
    const qrmatrix: string[][] = [];
    for (let i = 0; i < channels[0].values.length; i++) {
      const row: string[] = [];
      for (let j = 0; j < channels[0].values[0].length; j++) {
        const r = channels[0].values[i][j] ? '0' : 'f';
        const g = channels[1].values[i][j] ? '0' : 'f';
        const b = channels[2].values[i][j] ? '0' : 'f';

        row.push(`#${r}${g}${b}`);
      }
      qrmatrix.push(row);
    }

    return qrmatrix;
  }
}

// render qrmatrix to canvas
function renderQRMatrix (qrmatrix: string[][]) {
  const canvas = document.querySelector('#full');
  if (!canvas) throw new Error('Cannot find canvas element');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get canvas context');

  // get h,w from dom
  let h = canvas.height;
  let w = canvas.width;

  qrmatrix.forEach((row, i) => {
    row.forEach((color, j) => {
      ctx.fillStyle = color;
      ctx.fillRect(
        j * w / row.length,
        i * h / qrmatrix.length,
        w / row.length + 0.5,
        h / qrmatrix.length + 0.5
      );
    });
  });

  return canvas;
};

// channels
const r = new Channel('r', 'I am a QR code');
const g = new Channel('g', 'I aint really much of a QR code');
const b = new Channel('b', 'Its not easy being a QR code');

// convert to rgb
const rgb = r.matToRGB([r, g, b]);

// render
renderQRMatrix(rgb);

// duplicate canvas 3 times with red, green, blue filters
const canvas = document.querySelector('#full');
['#red', '#grn', '#blu'].forEach((sel) => {
  const filt = document.querySelector(sel);

  if (!(filt instanceof HTMLCanvasElement))
    throw new Error('Cannot get canvas context');
  filt.width = canvas.width;
  filt.height = canvas.height;

  const ctx = filt.getContext('2d');
  if (!ctx) throw new Error('Cannot get canvas context');

  // copy canvas to filter
  ctx.drawImage(canvas, 0, 0);
});

const red = document.querySelector('#red');
const grn = document.querySelector('#grn');
const blu = document.querySelector('#blu');

// apply filters i.e channel -> fff or 000
// for red, if red channel is f then fff else 000

// red
const ctx = red.getContext('2d');
if (!ctx) throw new Error('Cannot get canvas context');
const imageData = ctx.getImageData(0, 0, red.width, red.height);
const data = imageData.data;
for (let i = 0; i < data.length; i += 4) {
  if (data[i] === 255) {
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
  } else {
    data[i] = 0;
    data[i + 1] = 0;
    data[i + 2] = 0;
  }
}
ctx.putImageData(imageData, 0, 0);

// green
const ctx2 = grn.getContext('2d');
if (!ctx2) throw new Error('Cannot get canvas context');
const imageData2 = ctx2.getImageData(0, 0, grn.width, grn.height);
const data2 = imageData2.data;
for (let i = 0; i < data2.length; i += 4) {
  if (data2[i + 1] === 255) {
    data2[i] = 255;
    data2[i + 1] = 255;
    data2[i + 2] = 255;
  } else {
    data2[i] = 0;
    data2[i + 1] = 0;
    data2[i + 2] = 0;
  }
}
ctx2.putImageData(imageData2, 0, 0);

// blue
const ctx3 = blu.getContext('2d');
if (!ctx3) throw new Error('Cannot get canvas context');
const imageData3 = ctx3.getImageData(0, 0, blu.width, blu.height);
const data3 = imageData3.data;
for (let i = 0; i < data3.length; i += 4) {
  if (data3[i + 2] === 255) {
    data3[i] = 255;
    data3[i + 1] = 255;
    data3[i + 2] = 255;
  } else {
    data3[i] = 0;
    data3[i + 1] = 0;
    data3[i + 2] = 0;
  }
}
ctx3.putImageData(imageData3, 0, 0);
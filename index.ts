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
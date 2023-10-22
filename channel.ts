import { create } from 'qrcode';

export class Channel {
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
    const qr = create(str, {
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
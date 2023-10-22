import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { query } from 'lit/decorators/query.js';

import { Channel } from './channel.js';

// function renderQRMatrix (qrmatrix: string[][]) {
//   const canvas = document.querySelector('#full');
//   const ctx = canvas?.getContext('2d');
//   if (!ctx) throw new Error('Cannot get canvas context');

//   // get h,w from dom
//   let h = canvas.height;
//   let w = canvas.width;

//   qrmatrix.forEach((row, i) => {
//     row.forEach((color, j) => {
//       ctx.fillStyle = color;
//       ctx.fillRect(
//         j * w / row.length,
//         i * h / qrmatrix.length,
//         w / row.length,
//         h / qrmatrix.length
//       );
//     });
//   });

//   return canvas;
// };

// // channels
// const r = new Channel('r', 'I am a QR code');
// const g = new Channel('g', 'I aint really much of a QR code');
// const b = new Channel('b', 'Its not easy being a QR code');
// const rgb = r.matToRGB([r, g, b]);
// renderQRMatrix(rgb);

// document
//   ?.querySelector('#points')
//   ?.addEventListener('mouseup', (e) => {
//     const val = Number((e.target as HTMLInputElement).value);

//     const canvas = document.querySelector('#render');
//     const ctx = canvas?.getContext('2d');
//     if (!ctx) throw new Error('Cannot get canvas context');

//     rerender(canvas, val);
//   });

// function rerender (color, offset) {
//   const ctx = document?.querySelector('#full')?.getContext('2d')
//   const tgt = color.getContext('2d');
//   if (!ctx || !tgt) throw new Error("Can't get canvas ctx");

//   const imageData = ctx.getImageData(0, 0, color.width, color.height);
//   const data = imageData.data;

//   if (offset === 3) return tgt.putImageData(imageData, 0, 0);

//   for (let i = 0; i < data.length; i += 4) {
//     data[i] = data[i + 1] = data[i + 2] =
//       data[i + offset] === 255 ? 255 : 0;
//   }

//   tgt.putImageData(imageData, 0, 0);
// };

@customElement('m-qr')
export class MQR extends LitElement {
  @query('#render') canvas: HTMLCanvasElement;
  @property() src = "";
  @property() r = "" as string | Channel;
  @property() g = "" as string | Channel;
  @property() b = "" as string | Channel;

  // Define scoped styles right with your component, in plain CSS
  static styles = css`
    canvas{
      background:#fff;
    }
    .cont {
      background: #8888;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }`;

  display (qrmatrix: string[][]) {
    const canvas = this.renderRoot.querySelector('#render');
    console.log(canvas);

    const ctx = canvas?.getContext('2d');
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
          w / row.length,
          h / qrmatrix.length
        );
      });
    });

    return canvas;
  }


  firstUpdated () {
    // super.connectedCallback()
    this.r = new Channel('r', this.r);
    this.g = new Channel('g', this.g);
    this.b = new Channel('b', this.b);

    const rgb = this.r.matToRGB([this.r, this.g, this.b]);
    console.log(rgb);
    this.display(rgb);
  }

  render () {
    if (
      !this.src ||
      (this.r && this.g && this.b)
    ) return html`<div>No renderables found</div>`;

    return html`
    <canvas id="full" height="600" width="600" style="display: none;"></canvas>
    <div class="cont">
      <canvas id="render" height="600" width="600"></canvas>
      <input type="range" id="points" name="points" min="0" max="3">
    </div>`;
  }
};
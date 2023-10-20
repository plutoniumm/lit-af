## Multi Color QRCodes

Each channel r,g,b -> rgb color

Overlay red to get red only values and treat as binary image
this will return the QR stored in the red channel. Similar for green and blue.

Expected data packing is 3 bytes per pixel, 1 byte per channel i.e 3x normal QR size
const fs = require('fs');

const JPEG_MARKERS = new Set([
  0xc0, 0xc1, 0xc2, 0xc3,
  0xc5, 0xc6, 0xc7,
  0xc9, 0xca, 0xcb,
  0xcd, 0xce, 0xcf,
]);

const isPng = (buffer) =>
  buffer.length >= 24 &&
  buffer[0] === 0x89 &&
  buffer[1] === 0x50 &&
  buffer[2] === 0x4e &&
  buffer[3] === 0x47 &&
  buffer[4] === 0x0d &&
  buffer[5] === 0x0a &&
  buffer[6] === 0x1a &&
  buffer[7] === 0x0a;

const isJpeg = (buffer) => buffer.length > 4 && buffer[0] === 0xff && buffer[1] === 0xd8;

const readPngDimensions = (buffer) => ({
  width: buffer.readUInt32BE(16),
  height: buffer.readUInt32BE(20),
});

const readJpegDimensions = (buffer) => {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    const blockLength = buffer.readUInt16BE(offset + 2);

    if (JPEG_MARKERS.has(marker)) {
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      return { width, height };
    }

    offset += 2 + blockLength;
  }
  throw new Error('Unable to determine JPEG dimensions');
};

const getImageDimensions = (filePath) => {
  const buffer = fs.readFileSync(filePath);
  if (isPng(buffer)) {
    return readPngDimensions(buffer);
  }
  if (isJpeg(buffer)) {
    return readJpegDimensions(buffer);
  }
  throw new Error('Unsupported image format. Please upload a PNG or JPEG file.');
};

module.exports = {
  getImageDimensions,
};

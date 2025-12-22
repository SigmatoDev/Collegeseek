const { exec } = require("child_process");
const path = require("path");

const compressPdf = (inputPath) => {
  return new Promise((resolve, reject) => {
    const outputPath = inputPath.replace(".pdf", "-compressed.pdf");

    const command = `
      gs -sDEVICE=pdfwrite \
      -dCompatibilityLevel=1.4 \
      -dPDFSETTINGS=/ebook \
      -dNOPAUSE -dQUIET -dBATCH \
      -sOutputFile="${outputPath}" "${inputPath}"
    `;

    exec(command, (error) => {
      if (error) return reject(error);
      resolve(outputPath);
    });
  });
};

module.exports = compressPdf;

const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const path = require("path");

const compressPdf = async (inputPath) => {
  const pdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Create a new PDF and copy pages (this removes unused objects)
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
  copiedPages.forEach((page) => newPdf.addPage(page));

  const newPdfBytes = await newPdf.save({ useObjectStreams: false }); // smaller

  const outputPath = inputPath.replace(".pdf", "-compressed.pdf");
  fs.writeFileSync(outputPath, newPdfBytes);

  return outputPath;
};

module.exports = compressPdf;
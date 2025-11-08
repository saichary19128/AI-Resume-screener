const pdfParse = require('pdf-parse');

async function parsePDFBuffer(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

module.exports = { parsePDFBuffer };

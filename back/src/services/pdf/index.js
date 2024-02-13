const fs = require('fs');
const pdf = require('pdf-parse');

const extractTextFromPDF = (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  return pdf(dataBuffer);
}

module.exports = extractTextFromPDF;
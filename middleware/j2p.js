var express = require('express');
var router = express.Router();


async function json2pdf(data) {
    try {
        const jsonData = data;
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
        const { width, height } = page.getSize();

        const formattedData = JSON.stringify(jsonData, null, 2);

        const lines = formattedData.split('\n');

        let y = height - 50;
        for (const line of lines) {
            page.drawText(line, {
                x: 50,
                y: y,
                size: 12,
                color: rgb(0, 0, 0),
            });
            y -= 15;
        }

        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    } catch (err) {
        console.error('Error generating PDF:', err);
        throw err;
    }
}

module.exports = json2pdf;
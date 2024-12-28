import { Document, Packer, Paragraph } from 'docx';
import { PDFDocument } from 'pdf-lib';

export async function generateDocx(content) {
  const doc = new Document();
  content.forEach((slide, index) => {
    doc.addSection({
      children: [
        new Paragraph({
          text: `Slide ${index + 1}: ${slide.title}`,
          heading: "Heading1"
        }),
        ...slide.bullets.map(bullet => new Paragraph({
          text: bullet,
          bullet: { level: 0 }
        }))
      ],
    });
  });
  return await Packer.toBuffer(doc);
}

export async function generatePdf(content) {
  const pdfDoc = await PDFDocument.create();
  content.forEach((slide, index) => {
    const page = pdfDoc.addPage([600, 800]);
    page.drawText(`Slide ${index + 1}: ${slide.title}`, { x: 50, y: 750, size: 20 });
    slide.bullets.forEach((bullet, idx) => {
      page.drawText(`${idx + 1}. ${bullet}`, { x: 70, y: 730 - idx * 20, size: 12 });
    });
  });
  return await pdfDoc.save();
}
import Sentry from '../utils/sentryInit.js';
import { authenticateUser } from './_apiUtils.js';
import { generateDocx, generatePdf } from '../services/documentService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);
    const { format, content } = req.body;

    if (!format || !content) {
      return res.status(400).json({ error: 'Format and content are required' });
    }

    let fileBuffer;
    let mimeType;
    let fileName;

    if (format === 'docx') {
      fileBuffer = await generateDocx(content);
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      fileName = 'Presentation_Content.docx';
    } else if (format === 'pdf') {
      fileBuffer = await generatePdf(content);
      mimeType = 'application/pdf';
      fileName = 'Presentation_Content.pdf';
    } else {
      return res.status(400).json({ error: 'Invalid format. Choose "pdf" or "docx".' });
    }

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(fileBuffer);
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error exporting document:', error);
    res.status(500).json({ error: 'Error exporting document' });
  }
}
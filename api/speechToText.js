import * as Sentry from "@sentry/node";
import { authenticateUser } from "./_apiUtils.js";
import { GoogleSpeechToText } from 'google-speech-to-text-api'; // Replace with actual library or implementation

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID
    }
  }
});

const speechClient = new GoogleSpeechToText({
  apiKey: process.env.GOOGLE_SPEECH_TO_TEXT_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);
    const { audio } = req.body;

    if (!audio) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    // Convert audio to text using Google Speech-to-Text API
    const transcript = await speechClient.recognize(audio);

    res.status(200).json({ transcript });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error converting speech to text:', error);
    res.status(500).json({ error: 'Error converting speech to text' });
  }
}
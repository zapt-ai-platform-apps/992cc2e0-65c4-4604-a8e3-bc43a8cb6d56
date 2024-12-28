import * as Sentry from "@sentry/node";
import { authenticateUser } from "./_apiUtils.js";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { jokes } from '../drizzle/schema.js'; // Update as per your schema
import { OpenAIApi, Configuration } from 'openai';

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

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);
    const { title, topics, numSlides } = req.body;

    if (!title || !topics || !numSlides) {
      return res.status(400).json({ error: 'Title, topics, and number of slides are required' });
    }

    // Call OpenAI API to generate content
    const prompt = `Create a presentation titled "${title}" with the following topics: ${topics}. Generate ${numSlides} slides with bullet-pointed content for each topic.`;

    const aiResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const content = aiResponse.data.choices[0].message.content;

    // Assuming the AI returns a JSON string
    const slides = JSON.parse(content);

    res.status(200).json({ slides });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Error generating content' });
  }
}
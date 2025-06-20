import express from 'express';
import dotenv from 'dotenv';
import { CohereClient } from 'cohere-ai';

dotenv.config();

// Initialize Cohere client (correct for v7+)
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const router = express.Router();

router.post('/analyze', async (req, res) => {
  const { data } = req.body;

  const prompt = `You are a data analyst. Analyze this JSON data and provide insights, trends, and patterns:\n${JSON.stringify(data.slice(0, 20))}`;

  try {
    const response = await cohere.generate({
      model: 'command',
      prompt,
      maxTokens: 300,  // Note: camelCase in v7+
      temperature: 0.5,
    });

    const summary = response.generations[0].text.trim();
    res.json({ summary });

  } catch (err) {
    console.error('Cohere API error:', err);
    res.status(500).json({ error: 'AI analysis failed using Cohere' });
  }
});

export default router;
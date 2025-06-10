
import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/analyze', async (req, res) => {
  const { data } = req.body;
  
  const prompt = `You are a data analyst. Analyze this data and provide insights, trends, and patterns:\n${JSON.stringify(data.slice(0, 20))}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    const summary = response.choices[0].message.content;
    res.json({ summary });
  } catch (err) {
    console.error(err);
    
    // Handle quota exceeded error specifically
    if (err.code === 'insufficient_quota') {
      return res.status(500).json({ 
        error: 'OpenAI quota exceeded. Please add credits to your account at https://platform.openai.com/account/billing' 
      });
    }
    
    res.status(500).json({ error: 'AI analysis failed' });
  }
});

export default router;
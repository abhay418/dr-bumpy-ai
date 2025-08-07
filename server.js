// ✅ Dr. Bumpy Server - OpenRouter + Mixtral 8x7B Instruct

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistralai/mixtral-8x7b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are Dr. Bumpy, a kind and accurate pregnancy AI assistant. Offer trimester-specific tips, safe medications, emotional support, and answer symptoms gently and clearly.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    console.log("🔍 AI Response:", data);

    if (data.error) {
      console.error('❌ OpenRouter Error:', data.error.message);
      return res.status(500).json({ reply: `⚠️ AI Error: ${data.error.message}` });
    }

    const reply = data?.choices?.[0]?.message?.content || "❗Sorry, I couldn't generate a response.";
    res.json({ reply });

  } catch (err) {
    console.error('❌ Request Failed:', err);
    res.status(500).json({ reply: '⚠️ Error reaching AI. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Dr. Bumpy server running at http://localhost:${PORT}`);
});

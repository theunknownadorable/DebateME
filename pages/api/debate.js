const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const personalityMap = {
  'serious-scholar': 'Serious Scholar',
  'snarky-comedian': 'Snarky Comedian', 
  'aggressive-politician': 'Aggressive Politician',
  'chill-philosopher': 'Chill Philosopher'
};

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, stance, personality, userArgument } = req.body;

    // Validate required fields
    if (!topic || !stance || !personality || !userArgument) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // Construct the prompt
    const personalityLabel = personalityMap[personality] || personality;
    const oppositeStance = stance === 'for' ? 'against' : 'for';
    
    const prompt = `You are a world-class AI debater with the personality of ${personalityLabel}.
The debate topic is: "${topic}".
The human is arguing ${stance}; take the opposite stance and defend it persuasively.

Guidelines:
- Open with a confident, attention-grabbing line.
- Use logic, evidence, and rhetorical techniques in the tone of ${personalityLabel}.
- Directly challenge the user's points without repeating them word-for-word.
- End with a mic-drop style sentence.
The user just said: "${userArgument}"`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const counterArgument = response.text();

    // Return the counterargument
    res.status(200).json({ 
      counterArgument,
      topic,
      aiStance: oppositeStance,
      personality: personalityLabel
    });

  } catch (error) {
    console.error('Error generating counterargument:', error);
    
    // Handle different types of errors
    if (error.message?.includes('API key')) {
      return res.status(401).json({ error: 'Invalid API key' });
    } else if (error.message?.includes('quota')) {
      return res.status(429).json({ error: 'API quota exceeded' });
    } else if (error.message?.includes('safety')) {
      return res.status(400).json({ error: 'Content was blocked due to safety concerns' });
    }
    
    res.status(500).json({ error: 'Failed to generate counterargument' });
  }
}
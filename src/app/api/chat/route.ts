import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI SDK
// It will fall back to mock if no API key is provided
const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const SYSTEM_PROMPTS = {
  nova: `You are NOVA, the central AI assistant of a personalized digital doppelgänger dashboard. 
You act as the user's primary AI companion, helping coordinate daily tasks and general questions. 
Keep your responses concise, modern, and friendly. Act as the central brain. 
You can recommend activating specialized agents: Medico (health), Iris (work/study), Vault (finance), or Vibe (lifestyle) when user questions align with those fields.`,

  medico: `You are Medico, the specialized health AI agent. 
You act as a personal fitness heartbeat and health guide. 
Provide helpful recommendations on nutrition, workouts, sleep hygiene, and physical balance. 
Always include a light disclaimer that you are an AI assistant and not a medical doctor. 
Keep your tone encouraging, direct, and structured.`,

  iris: `You are Iris, the specialized work and study mentor AI. 
You guide the user with academic research support, coding queries, study roadmaps, career options, and focus strategies. 
Be highly analytical, structured, and insightful. Use bullet points or numbered lists to organize complex topics.`,

  vault: `You are Vault, the specialized finance guard AI. 
You help user calculate budgets, plan savings goals, understand financial terms, and establish risk security protocols. 
Focus heavily on security, cost-efficiency, and sound savings strategies. 
Provide financial calculations where helpful, and add a brief disclaimer that you provide educational guidance, not direct financial trading suggestions.`,

  vibe: `You are Vibe, the specialized lifestyle, mood, and daily balance partner. 
Speak in a warm, relaxed, motivating, and mindful tone. 
Help the user build positive habits, suggest meditation exercises, work-life boundaries, screen-free breaks, and mood boosters.`
};

export async function POST(request: Request) {
  try {
    const { message, agent, autonomy, history, customPrompt, maxTokens } = await request.json();

    const selectedAgent = (agent || 'nova') as keyof typeof SYSTEM_PROMPTS;
    const systemInstruction = customPrompt || SYSTEM_PROMPTS[selectedAgent] || SYSTEM_PROMPTS.nova;
    const temperature = autonomy !== undefined ? parseFloat(autonomy) : 0.7;
    const maxOutputTokens = maxTokens !== undefined ? parseInt(maxTokens) : 1000;

    // If API key is not configured, trigger Pollinations AI free text endpoint as fallback
    if (!genAI) {
      try {
        const apiMessages = [
          { role: 'system', content: systemInstruction },
          ...(history || []).map((h: any) => ({
            role: h.role === 'model' ? 'assistant' : 'user',
            content: h.parts?.[0]?.text || ''
          })),
          { role: 'user', content: message }
        ];

        const response = await fetch('https://text.pollinations.ai/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            model: 'openai'
          })
        });

        if (response.ok) {
          const text = await response.text();
          if (text && text.trim().length > 0) {
            return NextResponse.json({ reply: text });
          }
        }
        throw new Error('Empty response from Pollinations');
      } catch (err: any) {
        console.warn('Pollinations AI fallback failed, using local fallback:', err);
        // Fallback to a smart responsive mock
        let mockReply = `Analyzing "${message}" through the lens of ${selectedAgent.toUpperCase()}. 
To see active real-time AI replies, please add your GOOGLE_GENAI_API_KEY to your .env.local file in the project root folder.`;
        
        if (selectedAgent === 'medico') {
          mockReply = `As Medico, your health assistant, I recommend focusing on a balanced routine: 8 hours of sleep, regular hydration, and daily physical activity. For custom clinical insights, please set your GOOGLE_GENAI_API_KEY in the workspace.`;
        } else if (selectedAgent === 'vault') {
          mockReply = `As Vault, your secure finance advisor, I suggest looking into your budget formulas (e.g., the 50/30/20 rule: 50% needs, 30% wants, 20% savings). Ensure your GOOGLE_GENAI_API_KEY is configured to calculate automated budget trajectories.`;
        } else if (selectedAgent === 'iris') {
          mockReply = `As Iris, your work & study mentor, I advise structuring your tasks using the Pomodoro technique (25 min work, 5 min break) and setting clear milestone objectives. To analyze detailed coding or study files, please configure your GOOGLE_GENAI_API_KEY.`;
        } else if (selectedAgent === 'vibe') {
          mockReply = `As Vibe, your lifestyle companion, I think it is important to practice mindfulness. Take 5 deep breaths, step away from screens for 15 minutes, and structure your boundaries. Configure your GOOGLE_GENAI_API_KEY to unlock interactive mood feedback.`;
        }
        
        return NextResponse.json({ reply: mockReply });
      }
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: maxOutputTokens,
      },
      systemInstruction: systemInstruction,
    });

    // Simple chat session
    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error('Error in API Chat Route:', error);
    return NextResponse.json(
      { error: 'Failed to process chat response', details: error.message },
      { status: 500 }
    );
  }
}

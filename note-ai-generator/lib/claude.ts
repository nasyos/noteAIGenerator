const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: ClaudeMessage[];
}

export interface ClaudeResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export const callClaude = async (
  prompt: string,
  maxTokens: number = 4000
): Promise<{ text: string; tokens: number }> => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }

  const request: ClaudeRequest = {
    model: MODEL,
    max_tokens: maxTokens,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  };

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey.trim(),
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${errorText}`);
  }

  const data: ClaudeResponse = await response.json();

  return {
    text: data.content[0].text,
    tokens: data.usage.input_tokens + data.usage.output_tokens,
  };
};

export const callClaudeForJSON = async <T>(
  prompt: string,
  maxTokens: number = 4000
): Promise<{ data: T; tokens: number }> => {
  const { text, tokens } = await callClaude(prompt, maxTokens);

  try {
    // ```json ... ``` 形式の場合
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return {
        data: JSON.parse(jsonMatch[1]),
        tokens,
      };
    }

    // 直接JSONの場合
    return {
      data: JSON.parse(text),
      tokens,
    };
  } catch (error) {
    console.error('Failed to parse JSON from Claude response:', text);
    throw new Error('Invalid JSON response from Claude API');
  }
};
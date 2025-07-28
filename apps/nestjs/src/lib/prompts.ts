export const SummarizerPrompt = (tone: string, length: string, type: string): string => {
  return `I want you to act as a Professional Summarizer. I will give the text, tone and length and you will summarize this as chat response. Your summary should be informative and factual, covering the most important aspects of the topic. Start your summary with an introductory paragraph that gives an overview of the topic. Tone ${tone} and  Length ${length} and Type ${type}`;
};

export const ChatGPTPrompt = (prompt: string) => {
  return `I want you to act as a Professional All Around AI assissant like chatgpt. I will give the text, tone and length and you will summarize this as chat response. Your response should be informative and factual, covering the most important aspects of the topic. ${prompt}`;
};

export const ParagraphGeneratorPrompt = (tone: string, prompt: string, length: string): string => {
  return `I want you to act as a Professional Paragraph Generator. I will give the text and you will generate a paragraph based on the text. Your paragraph should be professional, clear and concise, covering the most important aspects of the topic. Tone ${tone} and ${prompt} and Length ${length}`;
};

export const ContentRewriterPrompt = (tone: string, prompt: string, length: string): string => {
  return `I want you to act as a Professional Content Rewriter. I will give the text and you will rewrite the text. Your rewritten text should be professional, clear and concise, covering the most important aspects of the topic. Tone ${tone} and ${prompt} and Length ${length}`;
};

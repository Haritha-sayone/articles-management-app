import React, { useState } from 'react';
import { OpenAI } from 'openai'; // Import OpenAI API
import './Chat.css'; // Import the CSS file for styling

const Chat: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState<{ question: string; response: string; votes: number }[]>([]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      const openai = new OpenAI({ 
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // Allow usage in browser-like environments
      });

      let retries = 3; // Number of retries
      let delay = 1000; // Initial delay in milliseconds

      while (retries > 0) {
        try {
          const aiResponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // Updated model
            messages: [{ role: 'user', content: question }], // Use messages for chat models
            max_tokens: 150,
          });

          const answer = aiResponse.choices[0]?.message?.content?.trim() || 'No response available.';
          setResponse(answer);

          const newEntry = { question, response: answer, votes: 0 };
          setHistory((prev) => [...prev, newEntry]);
          setQuestion('');
          return; // Exit the loop on success
        } catch (error: any) {
          if (error.response?.status === 429 && retries > 0) {
            console.warn(`Rate limit exceeded. Retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            retries--;
            delay *= 2; // Exponential backoff
          } else {
            throw error; // Rethrow if not a rate limit error or retries exhausted
          }
        }
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setResponse('Error: Unable to fetch response. Please try again later.');
    }
  };

  const handleVote = (index: number, delta: number) => {
    setHistory((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, votes: entry.votes + delta } : entry))
    );
  };

  return (
    <div className="chat-container">
      <h1>Chatbot</h1>
      <div className="chat-history">
        {history.map((entry, index) => (
          <div key={index} className="history-item">
            {index % 2 === 0 ? entry.response : entry.question}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something..."
        />
        <button onClick={handleAsk}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;

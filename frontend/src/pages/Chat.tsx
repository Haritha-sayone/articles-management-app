import React, { useState } from 'react';
import { HuggingFaceEmbeddings } from '../utils/embedding'; // Import HuggingFaceEmbeddings
import { Pinecone } from '@pinecone-database/pinecone'; // Import Pinecone
import './Chat.css'; // Import the CSS file for styling

const Chat: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState<{ question: string; response: string; votes: number }[]>([]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      const embeddings = new HuggingFaceEmbeddings(import.meta.env.VITE_HUGGINGFACE_API_KEY);
      const pinecone = new Pinecone({
        apiKey: import.meta.env.VITE_PINECONE_API_KEY,
        fetchApi: window.fetch,
      });

      // Generate embedding for the question
      let questionEmbedding;
      try {
        questionEmbedding = await embeddings.embedQuery(question);
      } catch (embeddingError) {
        console.error('Error generating embeddings:', embeddingError);
        setResponse('Error: Unable to generate embeddings for the question. Please try again later.');
        return;
      }

      // Perform similarity search in Pinecone
      const pineconeIndex = pinecone.Index('articles');
      const searchResults = await pineconeIndex.query({
        vector: questionEmbedding,
        topK: 3, // Retrieve top 3 similar articles
        includeMetadata: true,
      });

      if (searchResults.matches.length === 0) {
        setResponse('No relevant articles found.');
        return;
      }

      // Combine content from top articles for context
      const context = searchResults.matches
        .map((match: any) => match.metadata.text)
        .join('\n\n');

      let retries = 3; // Number of retries
      let delay = 1000; // Initial delay in milliseconds

      while (retries > 0) {
        try {
          // Call Gemini API for response generation
          const geminiResponse = await fetch(import.meta.env.VITE_GEMINI_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'gemini-1', // Specify the Gemini model
              prompt: `Context:\n${context}\n\nQuestion: ${question}`,
              max_tokens: 150,
            }),
          });

          if (!geminiResponse.ok) {
            throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
          }

          const geminiData = await geminiResponse.json();
          const answer = geminiData.choices[0]?.text?.trim() || 'No response available.';
          setResponse(answer);

          const newEntry = { question, response: answer, votes: 0 };
          setHistory((prev) => [...prev, newEntry]);
          setQuestion('');
          return; // Exit the loop on success
        } catch (error: any) {
          if (error.message.includes('429') && retries > 0) {
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
      console.error('Error fetching Gemini response:', error);
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

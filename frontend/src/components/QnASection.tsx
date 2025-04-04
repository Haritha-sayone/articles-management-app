import React, { useState } from 'react';

const QnASection: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question) return;

    setLoading(true);
    // Simulate API call to LLM model
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();
    setAnswers([...answers, data.answer]);
    setQuestion('');
    setLoading(false);
  };

  return (
    <div className="qna-section">
      <h2>Q&A Section</h2>
      <div className="ask-question">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
        />
        <button onClick={handleAskQuestion} disabled={loading}>
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </div>
      <div className="answers">
        {answers.map((answer, index) => (
          <div key={index} className="answer">
            <p>{answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QnASection;
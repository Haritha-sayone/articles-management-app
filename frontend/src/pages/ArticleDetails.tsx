import React from 'react';

const ArticleDetails: React.FC = () => {
  return (
    <div className="article-details">
      <h1>Article Title</h1>
      <p>Author: Author Name</p>
      <p>Published on: Date</p>
      <div className="article-content">
        <p>
          This is where the detailed content of the article will be displayed. 
          It can include text, images, and other media.
        </p>
      </div>
      <div className="article-actions">
        <button>Save Article</button>
        <button>Upvote</button>
        <button>Downvote</button>
      </div>
    </div>
  );
};

export default ArticleDetails;
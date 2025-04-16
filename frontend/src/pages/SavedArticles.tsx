import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeArticle } from '../store/savedArticlesSlice';
import ArticleCard from '../components/ArticleCard';

const SavedArticles: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.uid);
  const savedArticles = useSelector((state: RootState) =>
    userId && state.savedArticles.articlesByUser
      ? state.savedArticles.articlesByUser[userId] || []
      : []
  );
  const dispatch = useDispatch();

  return (
    <div className="saved-articles-container">
      <h1>Saved Articles</h1>
      {!userId ? (
        <div className="no-articles-container">
          <p className="no-articles-message">Please log in to view your saved articles.</p>
        </div>
      ) : savedArticles.length === 0 ? (
        <div className="no-articles-container">
          <p className="no-articles-message">No articles to display</p>
        </div>
      ) : (
        <div className="article-list grid-container">
          {savedArticles.map((article) => (
            <div className="grid-item article-card" key={article.id}>
              <ArticleCard
                id={article.id}
                title={
                  <a href={`/articles/${article.id}`} className="article-title-link">
                    {article.title}
                  </a>
                }
                summary={article.summary ?? ""}
                onSave={() => dispatch(removeArticle({ userId, articleId: article.id }))} // Dispatch removeArticle action
                buttonLabel="Remove" // Pass "Remove" as the button label
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedArticles;

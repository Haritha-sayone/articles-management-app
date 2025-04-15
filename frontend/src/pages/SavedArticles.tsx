import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeArticle } from '../store/savedArticlesSlice';
import ArticleCard from '../components/ArticleCard';

const SavedArticles: React.FC = () => {
  const savedArticles = useSelector((state: RootState) => state.savedArticles.articles);
  const dispatch = useDispatch();

  return (
    <div className="saved-articles-container">
      <h1>Saved Articles</h1>
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
              summary={article.summary}
              onSave={() => dispatch(removeArticle(article.id))} // Dispatch removeArticle action
              buttonLabel="Remove" // Pass "Remove" as the button label
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedArticles;

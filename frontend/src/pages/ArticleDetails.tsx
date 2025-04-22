import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { saveArticle } from '../store/savedArticlesSlice'; // Import saveArticle action
import { RootState } from '../store'; // Import RootState for type
import './ArticleDetails.css';

interface Article {
  id: number;
  title: string;
  author: string;
  createdDate: string;
  content: string;
  summary: string; // Added summary property
  category: string; // Added category property
}

const ArticleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.user?.uid);
  const savedArticles = useSelector((state: RootState) =>
    userId && state.savedArticles.articlesByUser
      ? state.savedArticles.articlesByUser[userId] || []
      : []
  );
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:5000/articles/${id}`);
        if (!response.ok) {
          throw new Error('Article not found');
        }
        const data: Article = await response.json();
        console.log('Fetched Article:', data); // Debug: Log the fetched article
        setArticle(data);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const isArticleSaved = useMemo(
    () => (id: number) => savedArticles.some((article: { id: number }) => article.id === id),
    [savedArticles]
  );

  if (loading) {
    return <div className="article-details-container">Loading...</div>;
  }

  if (!article) {
    return <div className="article-details-container">Article not found.</div>;
  }

  return (
    <div className="article-details-container">
      <h1 className="article-title">{article.title}</h1>
      <p className="article-author">Author: {article.author}</p>
      <p className="article-date">Published on: {article.createdDate}</p>
      <div className="article-content">
        <p>{article.content}</p>
      </div>
      <div className="article-actions">
        <button
          className="action-button"
          onClick={() => userId && dispatch(saveArticle({ userId, article }))}
          disabled={isArticleSaved(article.id)} // Disable button if already saved
        >
          {isArticleSaved(article.id) ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default ArticleDetails;
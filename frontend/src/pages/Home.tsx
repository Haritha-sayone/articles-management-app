import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveArticle } from '../store/savedArticlesSlice'; // Import saveArticle action
import { RootState } from '../store'; // Import RootState for type
import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/SearchBar';
import { ClipLoader } from 'react-spinners';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.user?.uid);
  const savedArticles = useSelector((state: RootState) =>
    userId && state.savedArticles.articlesByUser
      ? state.savedArticles.articlesByUser[userId] || []
      : []
  ); // Get saved articles for current user
  const [articles, setArticles] = useState<{ category: string; id: number; title: string; summary: string }[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<{ category: string; id: number; title: string; summary: string }[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(''); // Add state for search query
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:5000/articles');
        const data: { category: string; id: number; title: string; summary: string }[] = await response.json();
        setArticles(data);
        setFilteredArticles(data);

        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(data.map((article: any) => article.category as string))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching articles
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredArticles(
      selectedCategory === 'All'
        ? filtered
        : filtered.filter((article) => article.category === selectedCategory)
    );
  }, [searchQuery, articles, selectedCategory]); // Update filteredArticles when searchQuery or selectedCategory changes

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter((article) => article.category === category));
    }
  };

  const isArticleSaved = (id: number) => {
    return savedArticles.some((article: { id: number }) => article.id === id); // Check if the article is saved
  };

  return (
    <div>
      <main className="home-container">
        <h1>Welcome to Articles Management</h1>
        <div className="filters-and-search">
          <select
            className="category-filter"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <SearchBar onSearch={(query: string) => setSearchQuery(query)} />
        </div>
        <div className="featured-articles-section">
          {loading ? (
            <div className="loading-container">
              <ClipLoader size={50} color="#007bff" /> {/* Add spinner */}
            </div>
          ) : filteredArticles.length === 0 ? (
            <p className="no-articles-message">No articles to display</p>
          ) : (
            <div className="article-list grid-container">
              {filteredArticles.map((article: any) => (
                <div className="grid-item article-card" key={article.id}>
                  <ArticleCard
                    id={article.id}
                    title={
                      <a href={`/articles/${article.id}`} className="article-title-link">
                        {article.title}
                      </a>
                    }
                    summary={article.summary}
                    onSave={() => userId && dispatch(saveArticle({ userId, article }))} // Dispatch saveArticle action
                    buttonLabel={isArticleSaved(article.id) ? 'Saved' : 'Save'} // Show "Saved" or "Save"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
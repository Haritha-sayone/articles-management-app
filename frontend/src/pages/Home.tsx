import React, { useEffect, useState } from 'react';
import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/SearchBar';

const Home: React.FC = () => {
  const [articles, setArticles] = useState<{ category: string; id: number; title: string; summary: string }[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<{ category: string }[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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
      }
    };

    fetchArticles();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter((article: any) => article.category === category));
    }
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
          <SearchBar onSearch={(query: string) => console.log('Search query:', query)} />
        </div>
        <div className="featured-articles-section">
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
                  onSave={() => console.log(`Save article ${article.id}`)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
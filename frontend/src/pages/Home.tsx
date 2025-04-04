import React from 'react';
import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/SearchBar';

const Home: React.FC = () => {
  const featuredArticles = [
    { id: 1, title: 'Understanding React', summary: 'A deep dive into React and its ecosystem.' },
    { id: 2, title: 'JavaScript ES6 Features', summary: 'Explore the new features of JavaScript ES6.' },
    { id: 3, title: 'CSS Grid vs Flexbox', summary: 'A comparison of CSS Grid and Flexbox for layout.' },
  ];

  return (
    <div>
      <main className="container">
        <h1>Welcome to Articles Management</h1>
        <SearchBar onSearch={(query: string) => console.log('Search query:', query)} />
        <div className="featured-articles-section">
          <h2 className="featured-articles-heading">Featured Articles</h2>
          <div className="article-list grid-container">
            {featuredArticles.map(article => (
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
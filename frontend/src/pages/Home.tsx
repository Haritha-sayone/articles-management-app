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
        <h2>Featured Articles</h2>
        <div className="article-list">
          {featuredArticles.map(article => (
            <ArticleCard 
              key={article.id} 
              id={article.id} 
              title={article.title} 
              summary={article.summary} 
              onSave={() => console.log(`Save article ${article.id}`)} 
              onViewDetails={() => console.log(`View details of article ${article.id}`)} 
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
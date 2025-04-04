import React from 'react';
import ArticleCard from '../components/ArticleCard'; // Ensure the file exists at src/components/ArticleCard.tsx or update the path
import SearchBar from '../components/SearchBar';

const ArticleList: React.FC = () => {
  interface Article {
    id: number;
    title: string;
    content: string; // Add other fields as needed
  }

  const [articles, setArticles] = React.useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  const fetchArticles = async () => {
    // Fetch articles from the API (this function should be implemented in the api.ts file)
    const response = await fetch('/api/articles'); // Replace with your API endpoint
    const data = await response.json();
    setArticles(data);
  };

  React.useEffect(() => {
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="article-list">
      <h1>Articles</h1>
      <SearchBar onSearch={(query) => setSearchTerm(query)} />
      <div className="articles-container">
        {filteredArticles.map(article => (
          <ArticleCard
            key={article.id}
            id={article.id}
            title={article.title}
            summary={article.content}
            onSave={() => console.log(`Save article ${article.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
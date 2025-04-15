import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Article {
  id: number;
  title: string;
  summary: string;
  category: string;
}

interface SavedArticlesState {
  articles: Article[];
}

const initialState: SavedArticlesState = {
  articles: [],
};

const savedArticlesSlice = createSlice({
  name: 'savedArticles',
  initialState,
  reducers: {
    saveArticle(state, action: PayloadAction<Article>) {
      if (!state.articles.find((article) => article.id === action.payload.id)) {
        state.articles.push(action.payload);
      }
    },
    removeArticle(state, action: PayloadAction<number>) {
      state.articles = state.articles.filter((article) => article.id !== action.payload);
    },
  },
});

export const { saveArticle, removeArticle } = savedArticlesSlice.actions;
export default savedArticlesSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Article {
  id: number;
  title: string;
  summary: string;
  category: string;
}

interface SavedArticlesState {
  articlesByUser: { [userId: string]: Article[] };
}

const initialState: SavedArticlesState = {
  articlesByUser: {},
};

const savedArticlesSlice = createSlice({
  name: 'savedArticles',
  initialState,
  reducers: {
    saveArticle(state, action: PayloadAction<{ userId: string; article: Article }>) {
      const { userId, article } = action.payload;
      // Defensive: Ensure articlesByUser is always an object
      if (!state.articlesByUser) {
        state.articlesByUser = {};
      }
      if (!state.articlesByUser[userId]) {
        state.articlesByUser[userId] = [];
      }
      if (!state.articlesByUser[userId].find((a) => a.id === article.id)) {
        state.articlesByUser[userId].push(article);
      }
    },
    removeArticle(state, action: PayloadAction<{ userId: string; articleId: number }>) {
      const { userId, articleId } = action.payload;
      if (state.articlesByUser[userId]) {
        state.articlesByUser[userId] = state.articlesByUser[userId].filter((a) => a.id !== articleId);
      }
    },
  },
});

export const { saveArticle, removeArticle } = savedArticlesSlice.actions;
export default savedArticlesSlice.reducer;

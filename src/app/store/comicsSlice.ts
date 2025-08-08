import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Comic {
  id: number;
  title: string;
  thumbnail: { path: string; extension: string };
  rare?: boolean;
}

interface ComicsState {
  comics: Comic[];
  loading: boolean;
  error: string | null;
}

const initialState: ComicsState = {
  comics: [],
  loading: false,
  error: null,
};

export const fetchComics = createAsyncThunk(
  'comics/fetchComics',
  async (
    { offset = 0, limit = 20 }: { offset?: number; limit?: number }
  ) => {
    const res = await fetch(`/api/comics?offset=${offset}&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch comics');
    const data = await res.json();
    return data.data.results as Comic[];
  }
);

const comicsSlice = createSlice({
  name: 'comics',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchComics.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComics.fulfilled, (state, action) => {
        state.loading = false;

        const comics = action.payload;
        const count = Math.floor(comics.length * 0.1);
        const rareIndexes = new Set<number>();

        while (rareIndexes.size < count) {
          rareIndexes.add(Math.floor(Math.random() * comics.length));
        }

        state.comics = comics.map((comic, i) => ({
          ...comic,
          rare: rareIndexes.has(i),
        }));
      })
      .addCase(fetchComics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load comics';
      });
  },
});

export default comicsSlice.reducer;

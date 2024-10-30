import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRandomVerse } from './verseAPI';

export const getRandomVerse = createAsyncThunk(
    'verse/fetchRandom',
    async () => {
        const response = await fetchRandomVerse();
        return response;
    }
);

const initialState = {
    currentVerse: {
        content: 'Click the button to get a verse',
        reference: ''
    },
    history: [],
    status: 'idle',
    error: null
};

export const verseSlice = createSlice({
    name: 'verse',
    initialState,
    reducers: {
        selectHistoryVerse: (state, action) => {
            state.currentVerse = state.history[action.payload];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRandomVerse.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getRandomVerse.fulfilled, (state, action) => {
                state.status = 'idle';
                state.currentVerse = action.payload;
                state.history.unshift(action.payload);
                if (state.history.length > 5) {
                    state.history.pop();
                }
            })
            .addCase(getRandomVerse.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { selectHistoryVerse } = verseSlice.actions;

export default verseSlice.reducer;
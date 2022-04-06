import { createSlice } from "@reduxjs/toolkit";

const articleStateSlice = createSlice({

    name: "articleStateSlice",
    initialState: { articles: [], ids: [], loading: false },
    reducers: {
        GET_ARTICLES(state, action) {
            state.articles = action.payload.articles;
            state.ids = action.payload.ids;
            // console.log("art,id", state.articles, state.ids);
        }
    }

})

export const articleStateAction = articleStateSlice.actions;
export default articleStateSlice;
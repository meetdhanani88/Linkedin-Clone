import { configureStore } from "@reduxjs/toolkit";
import userStateSlice from "./userStateSlice";
import loadingStateSlice from "./loadingStateSlice";
import articleStateSlice from "./articleStateSlice";

const store = configureStore({
    reducer: {
        userState: userStateSlice.reducer,
        loadingState: loadingStateSlice.reducer,
        articleState: articleStateSlice.reducer
    }
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware()
})

export default store;
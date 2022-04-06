import { createSlice } from "@reduxjs/toolkit";

const loadingStateSlice = createSlice({

    name: "loadingStateSlice",
    initialState: { loading: false },
    reducers: {
        Setloading(state, action) {
            state.loading = action.payload;
        }

    }

})

export const loadingStateAction = loadingStateSlice.actions;
export default loadingStateSlice;
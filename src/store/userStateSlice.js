import { createSlice } from "@reduxjs/toolkit";

const userStateSlice = createSlice({

    name: "userStateSlice",
    initialState: { user: null },
    reducers: {
        Setuser(state, action) {
            state.user = action.payload;
            // console.log("jdsjks", state.user);
        }

    }

})

export const userStateAction = userStateSlice.actions;
export default userStateSlice;
import { createSlice } from '@reduxjs/toolkit';

const initialState = '/'; 

const navigationSlice = createSlice({
  name: 'navigations',
  initialState,
  reducers: {
    setPath: (state, action) => action.payload, 
    getPath:(state,action)=>{return state.navigations},
  },
});

export const { setPath } = navigationSlice.actions;
export const selectPath = (state) => state.navigations;
export const {getPath} =navigationSlice.actions
export default navigationSlice.reducer;

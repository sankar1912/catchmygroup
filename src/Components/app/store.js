import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from '../features/navigation/navigationSlice'
const store=configureStore({
    reducer:{
        navigations:navigationReducer,
    }

})
export default store;
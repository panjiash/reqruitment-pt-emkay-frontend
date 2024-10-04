import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice"; // Create this slice

const store = configureStore({
  reducer: {
    products: productReducer,
  },
});

export default store;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { backend } from "../config/baseUrl";
import { ProductInterface } from "../interface/productInterface";

interface ProductState {
  products: ProductInterface[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: {
    currentPage: number;
    search: string;
    itemsPerPage: number;
  }) => {
    const response = await axios.get(`${backend}/products`, {
      params: {
        page: params.currentPage + 1,
        per_page: params.itemsPerPage,
        search: params.search,
      },
    });
    return response.data.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export const { setProducts, deleteProduct } = productSlice.actions;
export default productSlice.reducer;

"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProduits = createAsyncThunk(
  "produits/fetchProduits",
  async () => {
    const response = await axios.get(`http://127.0.0.1:8000/produits`);
    return response.data;
    console.log(response.data);
  }
);

const produitsSlice = createSlice({
  name: "produits",
  initialState: {
    produits: [],
    status: "idle",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProduits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.produits = action.payload;
      })
      .addCase(fetchProduits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default produitsSlice.reducer;

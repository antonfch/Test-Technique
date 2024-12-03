"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Action asynchrone pour récupérer les produits
export const fetchProduits = createAsyncThunk(
  "produits/fetchProduits",
  async () => {
    const response = await axios.get(`http://127.0.0.1:8000/produits`);
    return response.data;
  }
);

// Action asynchrone pour ajouter un produit
export const addProduit = createAsyncThunk(
  "produits/addProduit",
  async (produit: any) => {
    const response = await axios.post(
      `http://127.0.0.1:8000/produits`,
      produit
    );
    return response.data;
  }
);

const produitsSlice = createSlice({
  name: "produits",
  initialState: {
    produits: [] as any[],
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

    builder
      .addCase(addProduit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addProduit.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.produits.push(action.payload);
      })
      .addCase(addProduit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default produitsSlice.reducer;

"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Action asynchrone pour récupérer les produits
export const fetchCategories = createAsyncThunk(
  "produits/fetchCategories",
  async () => {
    const response = await axios.get(`http://127.0.0.1:8000/categories`);
    return response.data;
  }
);

// Action asynchrone pour ajouter un produit
export const addCategorie = createAsyncThunk(
  "produits/addCategorie",
  async (categorie: any) => {
    const response = await axios.post(
      `http://127.0.0.1:8000/categories`,
      categorie
    );
    return response.data;
  }
);

export const updateCategorie = createAsyncThunk(
  "produits/updateCategorie",
  async ({ id, updatedCategorie }: any) => {
    const response = await axios.put(
      `http://127.0.0.1:8000/categories/${id}`,
      updatedCategorie
    );
    return response.data;
  }
);

const produitsSlice = createSlice({
  name: "produits",
  initialState: {
    categories: [] as any[],
    status: "idle",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });

    builder
      .addCase(addCategorie.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCategorie.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories.push(action.payload);
      })
      .addCase(addCategorie.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default produitsSlice.reducer;

"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  }
);

export const addCategorie = createAsyncThunk(
  "categories/addCategorie",
  async (categorie: any) => {
    const response = await axios.post(`${API_URL}/categories`, categorie);
    return response.data;
  }
);

export const updateCategorie = createAsyncThunk(
  "categories/updateCategorie",
  async ({ id, updatedCategorie }: any) => {
    const response = await axios.put(
      `${API_URL}/categories/${id}`,
      updatedCategorie
    );
    return response.data;
  }
);

export const deleteCategorie = createAsyncThunk(
  "categories/deleteCategorie",
  async (id: number) => {
    await axios.delete(`${API_URL}/categories/${id}`);
    return id;
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

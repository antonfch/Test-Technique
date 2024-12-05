"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Produit {
  id: number;
  nom: string;
  description: string;
  prix: number;
  categorie_id: number;
  dateCreation: string;
}

type UpdateProduitPayload = {
  id: number;
  updatedProduit: {
    nom: string;
    description: string;
    prix: number;
    categorie_id: number;
  };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchProduits = createAsyncThunk(
  "produits/fetchProduits",
  async () => {
    const response = await axios.get(`${API_URL}/produits`);
    return response.data;
  }
);

export const deleteProduit = createAsyncThunk(
  "produits/deleteProduit",
  async (id: number) => {
    await axios.delete(`${API_URL}/produits/${id}`);
    return id;
  }
);

export const updateProduit = createAsyncThunk<
  Produit,
  UpdateProduitPayload,
  { rejectValue: { message: string } }
>(
  "produits/updateProduit",
  async ({ id, updatedProduit }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/produits/${id}`,
        updatedProduit
      );
      console.log("Réponse API :", response.data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
        }
      }

      return rejectWithValue({ message: "Erreur inconnue" });
    }
  }
);

export const addProduit = createAsyncThunk(
  "produits/addProduit",
  async (produit: Partial<Produit>) => {
    const response = await axios.post(`${API_URL}/produits`, produit);
    return response.data;
  }
);

const produitsSlice = createSlice({
  name: "produits",
  initialState: {
    produits: [] as Produit[],
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
    builder
      .addCase(deleteProduit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProduit.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.produits = state.produits.filter(
          (produit) => produit.id !== action.payload
        );
      })
      .addCase(deleteProduit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
    builder
      .addCase(updateProduit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProduit.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.produits.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.produits[index] = action.payload;
        }
      })
      .addCase(updateProduit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default produitsSlice.reducer;

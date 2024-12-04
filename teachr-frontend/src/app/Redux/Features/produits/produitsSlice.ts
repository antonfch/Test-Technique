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

export const fetchProduits = createAsyncThunk(
  "produits/fetchProduits",
  async () => {
    const response = await axios.get(`http://127.0.0.1:8000/produits`);
    return response.data;
  }
);

export const deleteProduit = createAsyncThunk(
  "produits/deleteProduit",
  async (id: number) => {
    await axios.delete(`http://127.0.0.1:8000/produits/${id}`);
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
      const response = await axios.put(
        `http://127.0.0.1:8000/produits/${id}`,
        updatedProduit
      );
      return response.data;
    } catch (error: unknown) {
      // Vérifiez si l'erreur est une instance de AxiosError
      if (axios.isAxiosError(error)) {
        // Vérifiez si une réponse est disponible
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
          (p) => p.id === action.meta.arg.id
        );
        if (index !== -1) {
          state.produits[index] = {
            ...state.produits[index],
            ...action.meta.arg.updatedProduit,
          };
        }
      })
      .addCase(updateProduit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default produitsSlice.reducer;

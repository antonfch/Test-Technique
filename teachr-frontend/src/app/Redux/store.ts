"use client";

import { configureStore } from "@reduxjs/toolkit";
import produitsSlice from "./Features/produits/produitsSlice";
import categoriesSlice from "./Features/categories/categoriesSlice";

export const store = configureStore({
  reducer: {
    produits: produitsSlice,
    categories: categoriesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

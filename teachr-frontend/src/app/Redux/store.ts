"use client";

import { configureStore } from "@reduxjs/toolkit";
import produitsSlice from "./Features/produits/produitsSlice";

export const store = configureStore({
  reducer: {
    produits: produitsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

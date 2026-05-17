"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { Product } from "@/types";
import { QuickViewModal } from "./quick-view-modal";

interface QuickViewContextType {
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextType | null>(null);

export function useQuickView() {
  const ctx = useContext(QuickViewContext);
  if (!ctx) throw new Error("useQuickView must be used within QuickViewProvider");
  return ctx;
}

export function QuickViewProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);

  const openQuickView = useCallback((p: Product) => {
    setProduct(p);
  }, []);
  const closeQuickView = useCallback(() => setProduct(null), []);

  return (
    <QuickViewContext.Provider value={{ openQuickView, closeQuickView }}>
      {children}
      {product && <QuickViewModal product={product} onClose={closeQuickView} />}
    </QuickViewContext.Provider>
  );
}

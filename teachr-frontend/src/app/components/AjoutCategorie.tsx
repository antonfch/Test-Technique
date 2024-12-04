"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchCategories,
  addCategorie,
} from "../Redux/Features/categories/categoriesSlice";
import { AppDispatch } from "../Redux/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
interface EditProduitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AjoutProduit = ({ isOpen, onClose }: EditProduitModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [nom, setNom] = React.useState("");
  const [errors, setErrors] = useState<{ nom?: string; prix?: string }>({});

  const handleAddCategorie = () => {
    const validationErrors: { nom?: string; prix?: string } = {};

    // Validation des champs
    if (!nom) validationErrors.nom = "Le nom est obligatoire.";

    // Si des erreurs, on les affiche et on bloque l'envoi
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const newProduit = {
      nom,
    };
    console.log("Produit envoyé :", newProduit);
    dispatch(addCategorie(newProduit))
      .unwrap()
      .then(() => {
        setNom("");

        toast("Catégorie ajouté avec succès.", {
          duration: 5000,
        });
      })
      .catch((err) => {
        console.error("Erreur lors de l'ajout :", err);
        toast("Erreur lors de l'ajout de la catégorie.");
      });
    dispatch(fetchCategories());
    onClose();
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une categorie</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nom" className="text-right">
              Nom
            </Label>
            <Input
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="col-span-3"
            />
            {errors.nom && (
              <p className="col-span-4 text-red-500 text-sm">{errors.nom}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button className="bg-[#0254A3]" onClick={handleAddCategorie}>
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AjoutProduit;

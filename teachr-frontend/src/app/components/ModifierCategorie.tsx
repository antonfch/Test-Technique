'use client'

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCategorie, fetchCategories } from '../Redux/Features/categories/categoriesSlice';
import type { AppDispatch } from "../Redux/store";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

interface Categorie {
    id: number;
    nom: string;
}

interface EditProduitModalProps {
    categorie: Categorie;
    isOpen: boolean;
    onClose: () => void;
}

const ModifierProduit = ({ categorie, isOpen, onClose }: EditProduitModalProps) => {
    const [nom, setNom] = useState(categorie.nom);

    const dispatch = useDispatch<AppDispatch>();

    const handleSave = () => {
        const updatedCategorie = {
            nom,

        };

        dispatch(updateCategorie({ id: categorie.id, updatedCategorie }))
            .unwrap()
            .then(() => {
                alert('Produit modifié avec succès');
                onClose(); // Ferme la modale
            })
            .catch((err: { message: string }) => {
                console.error('Erreur lors de la modification :', err.message);
            });
        dispatch(fetchCategories());
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Modifier le produit</DialogTitle>
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
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button onClick={handleSave}>
                        Sauvegarder
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ModifierProduit;
'use client'

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProduit, fetchProduits } from '../Redux/Features/produits/produitsSlice';
import { RootState, AppDispatch } from '../Redux/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
interface Produit {
    id: number;
    nom: string;
    description: string;
    prix: number;
    categorie_id: number;
    dateCreation: string;
}

interface EditProduitModalProps {
    produit: Produit;
    isOpen: boolean;
    onClose: () => void;
}

const ModifierProduit = ({ produit, isOpen, onClose }: EditProduitModalProps) => {
    const [nom, setNom] = useState(produit.nom);
    const [description, setDescription] = useState(produit.description);
    const [prix, setPrix] = useState(produit.prix);
    const [categorie, setCategorie] = useState(produit.categorie_id);
    const categories = useSelector((state: RootState) => state.categories.categories);
    const dispatch = useDispatch<AppDispatch>();

    const handleSave = () => {
        const updatedProduit = {
            nom,
            description,
            prix,
            categorie_id: categorie,
        };

        console.log("Produit mis à jour :", updatedProduit);

        dispatch(updateProduit({ id: produit.id, updatedProduit }))
            .unwrap()
            .then(() => {
                onClose(); // Ferme la modale
            })
            .catch((err: { message: string }) => {
                console.error('Erreur lors de la modification :', err.message);
            });
        dispatch(fetchProduits());
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
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="prix" className="text-right">
                            Prix
                        </Label>
                        <Input
                            id="prix"
                            type="number"
                            value={prix}
                            onChange={(e) => setPrix(parseFloat(e.target.value))}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="categorie" className="text-right">Categorie</Label>
                        <Select
                            value={categorie ? categorie.toString() : ""}

                            onValueChange={(value) => {
                                console.log("Nouvelle catégorie sélectionnée :", value);
                                setCategorie(parseInt(value, 10));
                            }}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="-- Choisir une catégorie --" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.length === 0 ? (
                                    <SelectItem value="" disabled>
                                        Aucune catégorie disponible
                                    </SelectItem>
                                ) : (
                                    categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.nom}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>

                        </Select>

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
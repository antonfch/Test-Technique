'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories, addCategorie } from '../Redux/Features/categories/categoriesSlice';
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

interface EditProduitModalProps {

    isOpen: boolean;
    onClose: () => void;
}


const AjoutProduit = ({ isOpen, onClose }: EditProduitModalProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const status = useSelector((state: RootState) => state.produits.status);
    const categories = useSelector((state: RootState) => state.categories.categories);

    const [nom, setNom] = React.useState('');

    const handleAddCategorie = () => {
        const newProduit = {
            nom,
        };
        console.log("Produit envoyé :", newProduit);
        dispatch(addCategorie(newProduit))
            .unwrap()
            .then(() => {
                setNom("");
            })
            .catch((err) => console.error("Erreur lors de l'ajout :", err));
        dispatch(fetchCategories());
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
                    </div>



                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button onClick={handleAddCategorie}>
                        Sauvegarder
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AjoutProduit;

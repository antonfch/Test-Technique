'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProduit, fetchProduits } from '../Redux/Features/produits/produitsSlice';
import { fetchCategories } from '../Redux/Features/categories/categoriesSlice';
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
    const [prix, setPrix] = React.useState<number | string>(0);
    const [categorie, setCategorie] = React.useState(0);
    const [description, setDescription] = React.useState('');

    const handleAddProduit = () => {
        const prixAsNumber = typeof prix === 'string' ? parseFloat(prix) : prix;

        if (isNaN(prixAsNumber)) {
            console.error("Le prix doit être un nombre valide.");
            return;
        }
        const newProduit = {

            nom,
            description,
            prix: prixAsNumber,
            categorie_id: categorie,
        };
        console.log("Produit envoyé :", newProduit);
        dispatch(addProduit(newProduit))
            .unwrap()
            .then(() => {
                setNom("");
                setDescription("");
                setPrix(0);;
                setCategorie(0);
            })
            .catch((err) => console.error("Erreur lors de l'ajout :", err));
        dispatch(fetchProduits());
    };


    useEffect(() => {

        dispatch(fetchCategories());

    }, [dispatch]);


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
                    <div className="flex flex-col mb-4">
                        <label className="mb-2">Categorie :</label>

                        <select
                            value={categorie}
                            onChange={(e) => setCategorie(parseInt(e.target.value, 10))}
                            className="border px-2 py-1"
                        >
                            <option value="">-- Choisir une categorie --</option>
                            {categories.length === 0 ? (
                                <option disabled>Aucune catégorie disponible</option>
                            ) : (
                                categories.map((categorie) => (
                                    <option key={categorie.id} value={categorie.id}>
                                        {categorie.nom}
                                    </option>
                                ))
                            )}
                        </select>

                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button onClick={handleAddProduit}>
                        Sauvegarder
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AjoutProduit;

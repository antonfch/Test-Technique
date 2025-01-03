'use client';

import React, { useEffect, useState } from 'react';
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
import { toast } from "sonner"

interface EditProduitModalProps {

    isOpen: boolean;
    onClose: () => void;
}


const AjoutProduit = ({ isOpen, onClose }: EditProduitModalProps) => {
    const dispatch = useDispatch<AppDispatch>();


    const categories = useSelector((state: RootState) => state.categories.categories);

    const [nom, setNom] = React.useState('');
    const [prix, setPrix] = React.useState<number | string>(0);
    const [categorie, setCategorie] = React.useState(0);
    const [description, setDescription] = React.useState('');
    const [errors, setErrors] = useState<{ nom?: string; prix?: string }>({});

    const handleAddProduit = () => {

        const validationErrors: { nom?: string; prix?: string } = {};

        if (!nom) validationErrors.nom = 'Le nom est obligatoire.';
        if (!prix || isNaN(Number(prix))) validationErrors.prix = 'Le prix est obligatoire et doit être un nombre.';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
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

        dispatch(addProduit(newProduit))
            .unwrap()
            .then(() => {
                setNom("");
                setDescription("");
                setPrix(0);;
                setCategorie(0);

                toast("Produit ajouté avec succès.", {
                    duration: 5000,
                });
                onClose()
            })
            .catch((err) => {
                console.error("Erreur lors de l'ajout :", err);
                toast("Erreur lors de l'ajout du produit.");
            });
        dispatch(fetchProduits());


    };




    useEffect(() => {

        dispatch(fetchCategories());

    }, [dispatch]);


    return (

        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un produit</DialogTitle>
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
                        {errors.nom && <p className="col-span-4 text-red-500 text-sm">{errors.nom}</p>}
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
                        {errors.prix && <p className="col-span-4 text-red-500 text-sm">{errors.prix}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="categorie" className="text-right">Categorie</Label>
                        <Select
                            value={categorie.toString()}
                            onValueChange={(value) => setCategorie(parseInt(value, 10))}
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
                    <Button className='bg-[#0254A3]' onClick={handleAddProduit}>
                        Sauvegarder
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AjoutProduit;

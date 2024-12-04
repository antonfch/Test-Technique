'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProduits, deleteProduit } from '../Redux/Features/produits/produitsSlice';
import { fetchCategories } from '../Redux/Features/categories/categoriesSlice';
import { RootState, AppDispatch } from '../Redux/store';
import AjoutProduit from "../components/AjoutProduit"
import ModifierProduit from "../components/ModifierProduit";
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,

    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type Produits = {
    id: number;
    nom: string;
    description: string;
    prix: number;
    dateCreation: string;
    categorie_id: number;
};

const Home = () => {
    const dispatch = useDispatch<AppDispatch>();
    const produits = useSelector((state: RootState) => state.produits.produits);
    const status = useSelector((state: RootState) => state.produits.status);
    const error = useSelector((state: RootState) => state.produits.error);
    const categories = useSelector((state: RootState) => state.categories.categories);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenAjout, setIsModalOpenAjout] = useState(false);
    const [selectedProduit, setSelectedProduit] = useState<Produits | null>(null);

    const handleDelete = (id: number) => {
        dispatch(deleteProduit(id))
            .unwrap()
            .then(() => {
                console.log("Produit supprimé avec succès");
            })
            .catch((err) => {
                console.error("Erreur lors de la suppression :", err);
            });
        dispatch(fetchProduits());
    };

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchProduits());
    }, [dispatch]);
    const handleOpenModal = (produit: Produits) => {
        setSelectedProduit(produit);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedProduit(null);
        setIsModalOpen(false);
    };


    const handleOpenModalAjout = () => {
        setIsModalOpenAjout(true);
    };

    const handleCloseModalAjout = () => {
        setIsModalOpenAjout(false);
    };


    console.log(produits)



    return (
        <div className="container mx-auto p-4">

            {status === "failed" && <p className="text-red-500">Erreur : {error}</p>}

            <Button onClick={handleOpenModalAjout}>Ajouter un produit</Button>

            <Table>

                <TableHeader>
                    <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Date de création</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {produits.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">Aucun produit disponible</TableCell>
                        </TableRow>
                    ) : (
                        produits.map((produit: any) => (
                            <TableRow key={produit.id}>
                                <TableCell>{produit.nom}</TableCell>
                                <TableCell>{produit.description}</TableCell>
                                <TableCell>{produit.prix} €</TableCell>
                                <TableCell>
                                    {produit.categorie ? produit.categorie.nom : 'Non assigné'}
                                </TableCell>
                                <TableCell>{produit.dateCreation}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button onClick={() => handleOpenModal(produit)} variant="outline">
                                            Modifier
                                        </Button>
                                        <Button onClick={() => handleDelete(produit.id)} variant="destructive">
                                            Supprimer
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            {isModalOpenAjout && (
                <AjoutProduit
                    onClose={handleCloseModalAjout}
                    isOpen={isModalOpenAjout}
                />
            )}

            {isModalOpen && selectedProduit && (
                <ModifierProduit
                    produit={selectedProduit}
                    onClose={handleCloseModal}
                    isOpen={isModalOpen}
                />
            )}
        </div>
    );
};

export default Home;


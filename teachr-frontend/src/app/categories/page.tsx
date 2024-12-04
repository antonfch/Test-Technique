'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../Redux/Features/categories/categoriesSlice';
import { RootState, AppDispatch } from '../Redux/store';
import AjoutCategorie from "../components/AjoutCategorie"
import ModifierCategorie from "../components/ModifierCategorie";
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
    const categories = useSelector((state: RootState) => state.categories.categories);
    const status = useSelector((state: RootState) => state.produits.status);
    const error = useSelector((state: RootState) => state.produits.error);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenAjout, setIsModalOpenAjout] = useState(false);
    const [selectedCategorie, setselectedCategorie] = useState<Produits | null>(null);



    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);
    const handleOpenModal = (produit: Produits) => {
        setselectedCategorie(produit);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setselectedCategorie(null);
        setIsModalOpen(false);
    };


    const handleOpenModalAjout = () => {
        setIsModalOpenAjout(true);
    };

    const handleCloseModalAjout = () => {
        setIsModalOpenAjout(false);
    };

    return (
        <div className="container mx-auto p-4">

            {status === "failed" && <p className="text-red-500">Erreur : {error}</p>}

            <Button onClick={handleOpenModalAjout}>Ajouter une catégorie</Button>

            <Table>

                <TableHeader>
                    <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">Aucune catégorie disponible</TableCell>
                        </TableRow>
                    ) : (
                        categories.map((categorie: any) => (
                            <TableRow key={categorie.id}>
                                <TableCell>{categorie.nom}</TableCell>

                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button onClick={() => handleOpenModal(categorie)} variant="outline">
                                            Modifier
                                        </Button>
                                        <Button variant="destructive">
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
                <AjoutCategorie
                    onClose={handleCloseModalAjout}
                    isOpen={isModalOpenAjout}
                />
            )}

            {isModalOpen && selectedCategorie && (
                <ModifierCategorie
                    categorie={selectedCategorie}
                    onClose={handleCloseModal}
                    isOpen={isModalOpen}
                />
            )}
        </div>
    );
};

export default Home;


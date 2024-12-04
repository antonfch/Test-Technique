'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProduits, deleteProduit } from '../Redux/Features/produits/produitsSlice';
import { RootState, AppDispatch } from '../Redux/store';
import AjoutProduit from "../components/AjoutProduit"
import ModifierProduit from "../components/ModifierProduit";

type Produit = {
    id: number;
    nom: string;
    description: string;
    prix: number;
    dateCreation: string;
    categorie_id: { nom: string } | null; // `categorie` peut être un objet ou `null`
};


const Home = () => {
    const dispatch = useDispatch<AppDispatch>();
    const produits = useSelector((state: RootState) => state.produits.produits);
    const status = useSelector((state: RootState) => state.produits.status);
    const error = useSelector((state: RootState) => state.produits.error);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);

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

    const handleOpenModal = (produit: Produit) => {
        setSelectedProduit(produit);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedProduit(null);
        setIsModalOpen(false);
    };


    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProduits());
        }
    }, [status, dispatch]);



    if (produits.length === 0) {
        return (
            <div className=' container mx-auto p-4 '>
                <h1 className="text-2xl font-bold">Liste des Produits</h1>
                <table className="table-auto w-full mt-4 border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Nom</th>
                            <th className="border px-4 py-2">Description</th>
                            <th className="border px-4 py-2">Prix</th>
                            <th className="border px-4 py-2">Catégorie</th>
                            <th className="border px-4 py-2">Date de création</th>
                            <th className="border px-4 py-2">Action</th>
                        </tr>
                    </thead>
                </table>
                <p className=' w-full text-center'>Aucun produit disponible</p>
                <AjoutProduit />
            </div>

        );
    }


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Liste des Produits</h1>
            {status === "loading" && <p>Chargement...</p>}
            {status === "failed" && <p className="text-red-500">Erreur : {error}</p>}
            <table className="table-auto w-full mt-4 border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">Nom</th>
                        <th className="border px-4 py-2">Description</th>
                        <th className="border px-4 py-2">Prix</th>
                        <th className="border px-4 py-2">Catégorie</th>
                        <th className="border px-4 py-2">Date de création</th>
                        <th className="border px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {produits.map((produit: Produit) => (
                        <tr key={produit.id}>
                            <td className="border px-4 py-2">{produit.nom}</td>
                            <td className="border px-4 py-2">{produit.description}</td>
                            <td className="border px-4 py-2">{produit.prix} €</td>
                            <td className="border px-4 py-2">
                                {produit.categorie_id ? produit.categorie_id.nom : 'Non assigné'}
                            </td>
                            <td className="border px-4 py-2">{produit.dateCreation}</td>
                            <td className=" flex gap-5 border px-4 py-2">
                                <button onClick={() => handleOpenModal(produit)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Modifier
                                </button>
                                <button onClick={() => handleDelete(produit.id)} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
                                    Supprimer
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>
            </table>
            <AjoutProduit />
            {isModalOpen && selectedProduit && (
                <ModifierProduit
                    produit={selectedProduit}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default Home;

'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProduits } from '../Redux/Features/produits/produitsSlice';
import { RootState, AppDispatch } from '../Redux/store';

const Home = () => {
    const dispatch = useDispatch<AppDispatch>();
    const produits = useSelector((state: RootState) => state.produits.produits);
    const status = useSelector((state: RootState) => state.produits.status);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProduits());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <p>Chargement des produits...</p>;
    }

    if (status === 'failed') {
        return <p>Erreur lors de la récupération des produits.</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Liste des Produits</h1>
            <button>Ajouter un produit</button>
            <table className="table-auto w-full mt-4 border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">Nom</th>
                        <th className="border px-4 py-2">Prix</th>
                        <th className="border px-4 py-2">Catégorie</th>
                        <th className="border px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {produits.map((produit: any) => (
                        <tr key={produit.id}>
                            <td className="border px-4 py-2">{produit.nom}</td>
                            <td className="border px-4 py-2">{produit.prix} €</td>
                            <td className="border px-4 py-2">
                                {produit.categorie ? produit.categorie.nom : 'Non assigné'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Home;

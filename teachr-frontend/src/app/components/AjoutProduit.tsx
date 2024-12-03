'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProduit } from '../Redux/Features/produits/produitsSlice';
import { RootState, AppDispatch } from '../Redux/store';


const AjoutProduit = () => {
    const dispatch = useDispatch<AppDispatch>();
    const produits = useSelector((state: RootState) => state.produits.produits);
    const status = useSelector((state: RootState) => state.produits.status);
    const error = useSelector((state: RootState) => state.produits.error);

    const [nom, setNom] = React.useState('');
    const [prix, setPrix] = React.useState(0);
    const [categorie, setCategorie] = React.useState('');
    const [description, setDescription] = React.useState('');

    const handleAddProduit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newProduit = {
            nom,
            description,
            prix: parseFloat(prix),
            categorie,
        };
        dispatch(addProduit(newProduit))
            .unwrap()
            .then(() => {
                setNom("");
                setDescription("");
                setPrix("");
                setCategorie("");
            })
            .catch((err) => console.error("Erreur lors de l'ajout :", err));
    };





    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Produits</h1>

            {status === "loading" && <p>Chargement...</p>}
            {status === "failed" && <p className="text-red-500">Erreur : {error}</p>}

            <table className="table-auto w-full border-collapse border border-gray-200 mt-4">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">Nom</th>
                        <th className="border px-4 py-2">Description</th>
                        <th className="border px-4 py-2">Prix</th>
                    </tr>
                </thead>
                <tbody>
                    {produits.map((produit: any) => (
                        <tr key={produit.id}>
                            <td className="border px-4 py-2">{produit.nom}</td>
                            <td className="border px-4 py-2">{produit.description}</td>
                            <td className="border px-4 py-2">{produit.prix} €</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <form onSubmit={handleAddProduit} className="mt-6">
                <div className="flex flex-col mb-4">
                    <label className="mb-2">Nom :</label>
                    <input
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className="border px-2 py-1"
                        required
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label className="mb-2">Description :</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border px-2 py-1"
                        required
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label className="mb-2">Prix :</label>
                    <input
                        type="number"
                        value={prix}
                        onChange={(e) => setPrix(e.target.value)}
                        className="border px-2 py-1"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded"
                >
                    Ajouter Produit
                </button>
            </form>
        </div>
    );
};

export default AjoutProduit;

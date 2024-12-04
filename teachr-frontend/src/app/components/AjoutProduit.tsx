'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProduit, fetchProduits } from '../Redux/Features/produits/produitsSlice';
import { fetchCategories } from '../Redux/Features/categories/categoriesSlice';
import { RootState, AppDispatch } from '../Redux/store';


const AjoutProduit = () => {
    const dispatch = useDispatch<AppDispatch>();

    const status = useSelector((state: RootState) => state.produits.status);
    const categories = useSelector((state: RootState) => state.categories.categories);

    const [nom, setNom] = React.useState('');
    const [prix, setPrix] = React.useState<number | string>(0);
    const [categorie, setCategorie] = React.useState(0);
    const [description, setDescription] = React.useState('');

    const handleAddProduit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const prixAsNumber = typeof prix === 'string' ? parseFloat(prix) : prix;

        if (isNaN(prixAsNumber)) {
            console.error("Le prix doit être un nombre valide.");
            return;
        }
        const newProduit = {

            nom,
            description,
            prix: prixAsNumber,
            categorie: categorie,
        };
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
        <div className="container mx-auto ">


            {status === "loading" && <p>Chargement...</p>}

            <form onSubmit={handleAddProduit} className="mt-6">
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

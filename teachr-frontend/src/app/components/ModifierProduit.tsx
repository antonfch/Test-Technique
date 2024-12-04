import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProduit } from '../Redux/Features/produits/produitsSlice';


interface Produit {
    id: number;
    nom: string;
    description: string;
    prix: number;
    categorie_id: { nom: string };
    dateCreation: string;
}
const EditProduitModal = ({ produit, onClose }: { produit: Produit, onClose: () => void }) => {
    const [nom, setNom] = useState(produit.nom);
    const [description, setDescription] = useState(produit.description);
    const [prix, setPrix] = useState(produit.prix);

    const dispatch = useDispatch();

    const handleSave = () => {
        const updatedProduit = {
            nom,
            description,
            prix,
        };

        dispatch(updateProduit({ id: produit.id, updatedProduit }))
            .unwrap()
            .then(() => {
                alert('Produit modifié avec succès');
                onClose(); // Ferme la modale
            })
            .catch((err: { message: string }) => {
                console.error('Erreur lors de la modification :', err.message);
            });
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Modifier le produit</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom :
                    </label>
                    <input
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description :
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prix :
                    </label>
                    <input
                        type="number"
                        value={prix}
                        onChange={(e) => setPrix(parseInt(e.target.value, 10))}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        Sauvegarder
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProduitModal;

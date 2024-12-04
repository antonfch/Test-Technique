<?php

namespace App\Controller;

use App\Repository\ProduitRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Produit;
use App\Entity\Categorie;
use Symfony\Component\HttpFoundation\Request;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\Validator\Validator\ValidatorInterface;

class ProduitController extends AbstractController
{
    #[Route('/produits', name: 'get_all_produits', methods: ['GET'])]
    public function getAllProduits(ProduitRepository $produitRepository): JsonResponse
    {

        $produits = $produitRepository->findAll();
        if (!$produits) {
            return $this->json(['error' => 'Produit non trouvé'], 404);
        }
      

        return $this->json($produits, 200, [], ['groups' => 'produit_list']);
    }

    #[Route('/produits/{id}', name: 'get_all_produit', methods: ['GET'])]
    public function getProduit(ProduitRepository $produitRepository,int $id): JsonResponse
    {

        $produits = $produitRepository->find($id);

        if (!$produits) {
            return $this->json(['error' => 'Produit non trouvé'], 404);
        }

        return $this->json($produits, 200, [], ['groups' => 'produit_list']);
    }

    #[Route('/produits', name: 'create_produit', methods: ['POST'])]
    public function createProduit(
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
        // Décoder les données de la requête
        $data = json_decode($request->getContent(), true);
    
        if (!$data) {
            return $this->json(['error' => 'Données invalides'], 400);
        }
    
        // Créer une nouvelle instance de Produit
        $produit = new Produit();
        $produit->setNom($data['nom'] ?? null);
        $produit->setDescription($data['description'] ?? null);
        $produit->setPrix($data['prix'] ?? null);
        $produit->setDateCreation(new \DateTime());
    
        // Associer une catégorie si elle est fournie
        if (!empty($data['categorie_id'])) {
            $categorie = $entityManager->getRepository(Categorie::class)->find($data['categorie_id']);
            if (!$categorie) {
                return $this->json(['error' => 'Catégorie non trouvée'], 404);
            }
            $produit->setCategorie($categorie);
        }
    
        // Valider le produit
        $errors = $validator->validate($produit);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], 400);
        }
    
        // Persister le produit dans la base de données
        $entityManager->persist($produit);
        $entityManager->flush();
    
        return $this->json([
            'message' => 'Produit créé avec succès',
            'id' => $produit->getId(),
            'categorie' => $produit->getCategorie() ? [
                'id' => $produit->getCategorie()->getId(),
                'nom' => $produit->getCategorie()->getNom(),
            ] : null,
        ], 201);
    }
    

    #[Route('/produits/assign', name: 'assign_produit_to_categorie', methods: ['POST'])]
    public function assignProduitToCategorie(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        // Décoder les données JSON envoyées
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['produit_id'], $data['categorie_id'])) {
            return $this->json(['error' => 'Données invalides ou incomplètes'], 400);
        }

        // Récupérer le produit et la catégorie par leurs IDs
        $produit = $entityManager->getRepository(Produit::class)->find($data['produit_id']);
        $categorie = $entityManager->getRepository(Categorie::class)->find($data['categorie_id']);

        if (!$produit || !$categorie) {
            return $this->json(['error' => 'Produit ou catégorie non trouvés'], 404);
        }

        // Associer le produit à la catégorie
        $produit->setCategorie($categorie);

        // Sauvegarder dans la base de données
        $entityManager->persist($produit);
        $entityManager->flush();
        $entityManager->refresh($produit);

        return $this->json([
            'message' => 'Produit assigné à la catégorie avec succès',
            'produit' => [
                'id' => $produit->getId(),
                'nom' => $produit->getNom(),
                'categorie' => [
                    'id' => $categorie->getId(),
                    'nom' => $categorie->getNom(),
                ],
            ],
        ]);
    }

    #[Route('/produits/{id}', name: 'replace_produit', methods: ['PUT'])]
    public function replaceProduit(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
        $produit = $entityManager->getRepository(Produit::class)->find($id);

        if (!$produit) {
            return $this->json(['error' => 'Produit non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Données invalides'], 400);
        }

        // Remplacement complet des données
        $produit->setNom($data['nom'] ?? null);
        $produit->setDescription($data['description'] ?? null);
        $produit->setPrix($data['prix'] ?? null);

        $errors = $validator->validate($produit);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], 400);
        }

        $entityManager->flush();

        return $this->json(['message' => 'Produit remplacé avec succès']);
    }

    #[Route('/produits/{id}', name: 'update_produit_partial', methods: ['PATCH'])]
    public function updateProduitPartial(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
    $produit = $entityManager->getRepository(Produit::class)->find($id);

    if (!$produit) {
        return $this->json(['error' => 'Produit non trouvé'], 404);
    }

    $data = json_decode($request->getContent(), true);

    if (!$data) {
        return $this->json(['error' => 'Données invalides'], 400);
    }

    // Mise à jour partielle des données
    if (isset($data['nom'])) {
        $produit->setNom($data['nom']);
    }

    if (isset($data['description'])) {
        $produit->setDescription($data['description']);
    }

    if (isset($data['prix'])) {
        $produit->setPrix($data['prix']);
    }

    $errors = $validator->validate($produit);
    if (count($errors) > 0) {
        $errorMessages = [];
        foreach ($errors as $error) {
            $errorMessages[] = $error->getMessage();
        }
        return $this->json(['errors' => $errorMessages], 400);
    }

    $entityManager->flush();

    return $this->json(['message' => 'Produit mis à jour partiellement avec succès']);
    }
    #[Route('/produits/{id}', name: 'delete_produit', methods: ['DELETE'])]
    public function deleteProduit(int $id, EntityManagerInterface $entityManager): JsonResponse
    {

        $produit = $entityManager->getRepository(Produit::class)->find($id);

        if (!$produit) {
            return $this->json(['error' => 'Produit non trouvé'], 404);
        }

        $entityManager->remove($produit);
        $entityManager->flush();

        return $this->json(['message' => 'Produit supprimé avec succès'], 200);
    }
}
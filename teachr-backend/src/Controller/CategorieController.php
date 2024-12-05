<?php

namespace App\Controller;

use App\Repository\CategorieRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Categorie;
use Symfony\Component\HttpFoundation\Request;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\Validator\Validator\ValidatorInterface;

class CategorieController extends AbstractController
{


    #[Route('/categories', name: 'get_all_categories', methods: ['GET'])]
    public function getAllCategories(CategorieRepository $categorieRepository): JsonResponse
    {

        $categories = $categorieRepository->findAll();
        if (!$categories) {
            return $this->json(['error' => 'Catégorie non trouvé'], 404);
        }
        
        return $this->json($categories, 200, [], ['groups' => 'categorie_list']);
    }

    #[Route('/categories/{id}', name: 'get_all_categorie', methods: ['GET'])]
    public function getCategorie(CategorieRepository $categorieRepository,int $id): JsonResponse
    {

        $categories = $categorieRepository->find($id);

        if (!$categories) {
            return $this->json(['error' => 'Catégorie non trouvé'], 404);
        }

        return $this->json($categories, 200, [], ['groups' => 'categorie_list']);
    }

    #[Route('/categories/{id}/produits', name: 'get_categorie_produits', methods: ['GET'])]
    public function getCategorieProduits(int $id, EntityManagerInterface $entityManager): JsonResponse
    {

        $categorie = $entityManager->getRepository(Categorie::class)->find($id);

        if (!$categorie) {
            return $this->json(['error' => 'Catégorie non trouvée'], 404);
        }

        $produits = $categorie->getCategorieProduits();
        if ($produits instanceof Collection && $produits->isEmpty()) {
            $entityManager->initializeObject($produits);
        }

        if ($produits->isEmpty()) {
            return $this->json(['error' => 'Aucun produit associé à cette catégorie'], 404);
        }

        return $this->json($produits, 200, [], ['groups' => 'produit_list']);
    }

    #[Route('/categories', name: 'create_categorie', methods: ['POST'])]
    public function createCategorie(
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
       
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Données invalides'], 400);
        }

        
        $categories = new Categorie();
        $categories ->setNom($data['nom'] ?? null);

        
        $errors = $validator->validate( $categories);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], 400);
        }

        $entityManager->persist( $categories);
        $entityManager->flush();

        return $this->json(['message' => 'Catégorie créé avec succès', 'id' =>  $categories->getId()], 201);
    }
    #[Route('/categories/{id}', name: 'replace_categorie', methods: ['PUT'])]
    public function replaceCategorie(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
        $categories = $entityManager->getRepository(Categorie::class)->find($id);

        if (! $categories) {
            return $this->json(['error' => 'Catégorie non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Données invalides'], 400);
        }

        $categories->setNom($data['nom'] ?? null);
    

        $errors = $validator->validate( $categories);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], 400);
        }

        $entityManager->flush();

        return $this->json(['message' => 'Catégorie remplacé avec succès']);
    }

    #[Route('/categories/{id}', name: 'update_categorie_partial', methods: ['PATCH'])]
    public function updateCategoriePartial(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
        $categories = $entityManager->getRepository(Categorie::class)->find($id);

    if (! $categories) {
        return $this->json(['error' => 'Catégorie non trouvé'], 404);
    }

    $data = json_decode($request->getContent(), true);

    if (!$data) {
        return $this->json(['error' => 'Catégorie invalides'], 400);
    }

    if (isset($data['nom'])) {
        $categories->setNom($data['nom']);
    }


    $errors = $validator->validate( $categories);
    if (count($errors) > 0) {
        $errorMessages = [];
        foreach ($errors as $error) {
            $errorMessages[] = $error->getMessage();
        }
        return $this->json(['errors' => $errorMessages], 400);
    }

    $entityManager->flush();

    return $this->json(['message' => 'Catégorie mis à jour partiellement avec succès']);
    }

    #[Route('/categories/{id}', name: 'delete_categorie', methods: ['DELETE'])]
    public function deleteCategorie(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $categorie = $entityManager->getRepository(Categorie::class)->find($id);

        if (!$categorie) {
            return $this->json(['error' => 'Catégorie non trouvée'], 404);
        }
        if ($categorie->getCategorieProduits()->count() > 0) {
            return $this->json(['error' => 'Impossible de supprimer une catégorie contenant des produits'], 400);
        }

        $entityManager->remove($categorie);
        $entityManager->flush();

        return $this->json(['message' => 'Catégorie supprimée avec succès'], 200);
    }
}

<?php

namespace App\Entity;

use App\Repository\CategorieRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CategorieRepository::class)]
class Categorie
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['categorie_list', 'categorie_detail'])]
    private ?int $id = null;

    #[Groups(['categorie_list', 'categorie_detail'])]
    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    /**
     * @var Collection<int, Produit>
     */
    #[ORM\OneToMany(targetEntity: Produit::class, mappedBy: 'categorie')]
    private Collection $CategorieProduits;

    public function __construct()
    {
        $this->CategorieProduits = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    /**
     * @return Collection<int, Produit>
     */
    public function getCategorieProduits(): Collection
    {
        return $this->CategorieProduits;
    }

    public function addCategorieProduit(Produit $categorieProduit): static
    {
        if (!$this->CategorieProduits->contains($categorieProduit)) {
            $this->CategorieProduits->add($categorieProduit);
            $categorieProduit->setCategorie($this);
        }

        return $this;
    }

    public function removeCategorieProduit(Produit $categorieProduit): static
    {
        if ($this->CategorieProduits->removeElement($categorieProduit)) {
            // set the owning side to null (unless already changed)
            if ($categorieProduit->getCategorie() === $this) {
                $categorieProduit->setCategorie(null);
            }
        }

        return $this;
    }
}

'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProduits, deleteProduit } from '../Redux/Features/produits/produitsSlice'
import { fetchCategories } from '../Redux/Features/categories/categoriesSlice'
import { RootState, AppDispatch } from '../Redux/store'
import AjoutProduit from "../components/AjoutProduit"
import ModifierProduit from "../components/ModifierProduit"
import { Button } from '@/components/ui/button'
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTablePagination } from '../../components/data-table-pagination'
import { ChevronLeft } from "lucide-react"

type Produit = {
    id: number
    nom: string
    description: string
    prix: number
    dateCreation: string
    categorie: { nom: string } | null
    categorie_id: number
}

export default function ProductsPage() {
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const produits = useSelector((state: RootState) => state.produits.produits)
    const status = useSelector((state: RootState) => state.produits.status)
    const error = useSelector((state: RootState) => state.produits.error)

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalOpenAjout, setIsModalOpenAjout] = useState(false)
    const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null)

    useEffect(() => {
        dispatch(fetchCategories())
        dispatch(fetchProduits())
    }, [dispatch])

    const handleDelete = (id: number) => {
        dispatch(deleteProduit(id))
            .unwrap()
            .then(() => {
                console.log("Produit supprimé avec succès")
                dispatch(fetchProduits())
            })
            .catch((err) => {
                console.error("Erreur lors de la suppression :", err)
            })
    }

    const handleOpenModal = (produit: Produit) => {
        setSelectedProduit(produit)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setSelectedProduit(null)
        setIsModalOpen(false)
    }

    const handleOpenModalAjout = () => {
        setIsModalOpenAjout(true)
    }

    const handleCloseModalAjout = () => {
        setIsModalOpenAjout(false)
    }

    const columns: ColumnDef<Produit>[] = [
        {
            accessorKey: "nom",
            header: "Nom",
            cell: ({ row }) => <div className="capitalize">{row.getValue("nom")}</div>,
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => <div className="lowercase">{row.getValue("description")}</div>,
        },
        {
            accessorKey: "prix",
            header: "Prix",
            cell: ({ row }) => <div className="text-right">{row.getValue("prix")}€</div>,
        },
        {
            accessorKey: "categorie.nom",
            header: "Catégorie",
            cell: ({ row }) => <div>{row.original.categorie?.nom || 'Non assigné'}</div>,
        },
        {
            accessorKey: "dateCreation",
            header: "Date de création",
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const produit = row.original
                return (
                    <div className="flex gap-2">
                        <Button onClick={() => handleOpenModal(produit)} variant="outline" size="sm">
                            Modifier
                        </Button>
                        <Button className='bg-[#FF724F]' onClick={() => handleDelete(produit.id)} variant="destructive" size="sm">
                            Supprimer
                        </Button>
                    </div>
                )
            },
        },
    ]

    const table = useReactTable({
        data: produits,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="container mx-auto py-10">
            <Button variant="outline" onClick={() => router.push("/categories")}><ChevronLeft /> Voir les catégories</Button>
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Filtrer par nom..."
                    value={(table.getColumn("nom")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("nom")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div className="flex items-center gap-2">
                    <Button className='bg-[#0254A3]' onClick={handleOpenModalAjout}>Ajouter un produit</Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">Colonnes</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Aucun résultat.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="py-4">
                <DataTablePagination table={table} />
            </div>
            {status === "failed" && <p className="text-red-500 mt-4">Erreur : {error}</p>}
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
    )
}


'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories, deleteCategorie } from '../Redux/Features/categories/categoriesSlice';
import { RootState, AppDispatch } from '../Redux/store';
import AjoutCategorie from "../components/AjoutCategorie";
import ModifierCategorie from "../components/ModifierCategorie";
import { Button } from '@/components/ui/button';
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
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTablePagination } from '../../components/data-table-pagination';
import { ChevronLeft } from "lucide-react"

type Categorie = {
    id: number;
    nom: string;
    dateCreation: string;
};

export default function CategoriesPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const categories = useSelector((state: RootState) => state.categories.categories);
    const status = useSelector((state: RootState) => state.categories.status);
    const error = useSelector((state: RootState) => state.categories.error);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenAjout, setIsModalOpenAjout] = useState(false);
    const [selectedCategorie, setSelectedCategorie] = useState<Categorie | null>(null);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleDelete = (id: number) => {
        dispatch(deleteCategorie(id))
            .unwrap()
            .then(() => {
                console.log("Catégorie supprimée avec succès");
                dispatch(fetchCategories());
            })
            .catch((err) => {
                console.error("Erreur lors de la suppression :", err);
            });
    };

    const handleOpenModal = (categorie: Categorie) => {
        setSelectedCategorie(categorie);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedCategorie(null);
        setIsModalOpen(false);
    };

    const handleOpenModalAjout = () => {
        setIsModalOpenAjout(true);
    };

    const handleCloseModalAjout = () => {
        setIsModalOpenAjout(false);
    };

    const columns: ColumnDef<Categorie>[] = [
        {
            accessorKey: "nom",
            header: "Nom",
            cell: ({ row }) => <div className="capitalize">{row.getValue("nom")}</div>,
        },
        {
            accessorKey: "dateCreation",
            header: "Date de création",
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const categorie = row.original;
                return (
                    <div className="flex gap-2">
                        <Button onClick={() => handleOpenModal(categorie)} variant="outline" size="sm">
                            Modifier
                        </Button>
                        <Button className='bg-[#FF724F]' onClick={() => handleDelete(categorie.id)} variant="destructive" size="sm">
                            Supprimer
                        </Button>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: categories,
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
    });

    return (
        <div className="container mx-auto py-10">
            <Button variant="outline" onClick={() => router.push("/produits")}><ChevronLeft /> Voir les produits</Button>
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
                    <Button className='bg-[#0254A3]' onClick={handleOpenModalAjout}>Ajouter une catégorie</Button>

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
                                    );
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
                                    );
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
                                    Aucune catégorie disponible.
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
}

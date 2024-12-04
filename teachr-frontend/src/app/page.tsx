"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center  h-screen p-48 gap-10 ">
      <div className="flex items-center gap-2 text-5xl 2xl:text-2xl font-bold">
        <span>Application de Gestion :</span>
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-4 py-2 shadow-md rounded-tl-full rounded-br-full rounded-tr-[4000px] rounded-bl-[4000px]">
          Produits et Catégories
        </div>
        <span>avec Symfony et React.js</span>
      </div>

      <ul className="flex text-xl w-2/6 justify-between ">
        <Button
          variant={"outline"}
          className="text-xl px-10 py-2 bg-[#209CFF] rounded-full text-white"
        >
          <Link href="/produits">Produits</Link>
        </Button>
        <Button
          variant={"outline"}
          className="text-xl px-10 py-2 bg-[#FF724F] rounded-full text-white "
        >
          <Link href="/categories">Categories</Link>
        </Button>
      </ul>
    </div>
  );
}

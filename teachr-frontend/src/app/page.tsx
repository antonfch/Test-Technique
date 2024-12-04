'use client';
import Link from 'next/link'

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/produits">Produits</Link>
      </li>
      <li>
        <Link href="/categories">Categories</Link>
      </li>
    </ul>
  );
}

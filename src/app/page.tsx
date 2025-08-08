
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Tool = {
  id: string; title: string; category: string;
  pricePerDay: number; deposit: number; photos: string[];
}

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([])

  useEffect(() => {
    // demo: pedir herramientas cercanas a Kendall (lat/lng aproximados)
    const params = new URLSearchParams({ lat: '25.6866', lng: '-80.3568', radiusKm: '10' })
    fetch(`/api/tools?${params}`).then(r => r.json()).then(setTools).catch(()=>{})
  }, [])

  return (
    <main className="container py-8 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tulado</h1>
        <nav className="flex gap-3">
          <Link className="btn" href="#">Publicar herramienta</Link>
          <Link className="btn" href="#">Iniciar sesión</Link>
        </nav>
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card min-h-[360px] flex items-center justify-center">
          <div>[Aquí va el mapa de Mapbox]</div>
        </div>
        <aside className="card space-y-3">
          <h2 className="text-lg font-semibold">Cerca de ti</h2>
          <ul className="space-y-2">
            {tools.map(t => (
              <li key={t.id} className="border border-zinc-800 rounded-xl p-3">
                <div className="font-medium">{t.title}</div>
                <div className="text-sm opacity-80">{t.category}</div>
                <div className="text-sm mt-1">${(t.pricePerDay/100).toFixed(2)}/día · Depósito ${(t.deposit/100).toFixed(2)}</div>
              </li>
            ))}
            {tools.length === 0 && <li className="opacity-70">Pronto verás herramientas aquí…</li>}
          </ul>
        </aside>
      </section>
    </main>
  )
}

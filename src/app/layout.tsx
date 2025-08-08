
import './styles/globals.css'

export const metadata = {
  title: 'Tulado — Alquila herramientas cerca de ti',
  description: 'Marketplace P2P de herramientas en Miami/Kendall',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

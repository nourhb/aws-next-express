import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-bold text-xl">
          AWS Project
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/users">
            <Button variant="ghost">Utilisateurs</Button>
          </Link>
          <Link href="/files">
            <Button variant="ghost">Fichiers</Button>
          </Link>
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}

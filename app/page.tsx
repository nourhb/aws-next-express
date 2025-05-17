import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Gestionnaire de fichiers et utilisateurs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestion des utilisateurs</CardTitle>
            <CardDescription>Ajoutez, modifiez et supprimez des utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Gérez les utilisateurs avec leurs informations personnelles et photos de profil.</p>
            <Link href="/users">
              <Button className="w-full">Accéder à la gestion des utilisateurs</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gestion des fichiers</CardTitle>
            <CardDescription>Uploadez et gérez vos fichiers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Uploadez, téléchargez et supprimez des fichiers stockés dans le bucket S3.</p>
            <Link href="/files">
              <Button className="w-full">Accéder à la gestion des fichiers</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

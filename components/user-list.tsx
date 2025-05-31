"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Trash2, UserIcon, Search, Edit, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface User {
  id: string
  name: string
  email: string
  profilePictureUrl: string
  createdAt: string
  updatedAt: string
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(
      user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des utilisateurs")
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error(error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'utilisateur")
      }

      setUsers(users.filter((user) => user.id !== id))
      toast({
        title: "Succès",
        description: "L'utilisateur a été supprimé avec succès",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement des utilisateurs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''}
          </Badge>
          <Link href="/users/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          </Link>
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <UserIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm ? "Aucun utilisateur trouvé" : "Aucun utilisateur"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? "Essayez de modifier votre recherche" 
                : "Commencez par ajouter votre premier utilisateur"
              }
            </p>
            {!searchTerm && (
              <Link href="/users/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un utilisateur
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4 flex-1">
                    <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                      <AvatarImage src={user.profilePictureUrl || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="text-lg font-medium">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{user.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Créé le {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link href={`/users/${user.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                    disabled={deletingId === user.id}
                    className="aspect-square p-0 w-9"
                  >
                    {deletingId === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

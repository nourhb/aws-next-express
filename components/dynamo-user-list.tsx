"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit, Plus, Users, Loader2, Database } from "lucide-react"
import { DynamoUserForm } from "./dynamo-user-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface DynamoUser {
  id: string  // UUID for DynamoDB
  name: string
  email: string
  profilePictureUrl: string
  createdAt: string
  updatedAt: string
}

export function DynamoUserList() {
  const [users, setUsers] = useState<DynamoUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<DynamoUser | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/dynamo-users")
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des utilisateurs DynamoDB")
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error(error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs depuis DynamoDB",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (user: DynamoUser) => {
    setEditingUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (userId: string) => {
    setDeletingUserId(userId)
    try {
      const response = await fetch(`/api/dynamo-users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'utilisateur")
      }

      toast({
        title: "Succès",
        description: "L'utilisateur a été supprimé avec succès de DynamoDB",
      })

      // Refresh the list
      fetchUsers()
    } catch (error) {
      console.error(error)
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'utilisateur de DynamoDB",
        variant: "destructive",
      })
    } finally {
      setDeletingUserId(null)
    }
  }

  const handleSuccess = () => {
    setIsEditDialogOpen(false)
    setIsAddDialogOpen(false)
    setEditingUser(null)
    fetchUsers()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des utilisateurs DynamoDB...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-orange-600" />
          <h1 className="text-xl font-bold">Utilisateurs DynamoDB</h1>
          <Badge variant="secondary">{users.length}</Badge>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau utilisateur (DynamoDB)</DialogTitle>
            </DialogHeader>
            <DynamoUserForm 
              onSuccess={handleSuccess} 
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
        <Database className="h-4 w-4 text-orange-600" />
        <p className="text-sm text-orange-800 dark:text-orange-200">
          <strong>Source:</strong> Amazon DynamoDB - Base NoSQL avec performance élevée et scalabilité automatique
        </p>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun utilisateur trouvé</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par ajouter votre premier utilisateur dans DynamoDB
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau utilisateur (DynamoDB)</DialogTitle>
                </DialogHeader>
                <DynamoUserForm 
                  onSuccess={handleSuccess} 
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id} className="overflow-hidden border-orange-200 dark:border-orange-800">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                    <AvatarImage src={user.profilePictureUrl} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-lg">{user.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge variant="outline" className="text-xs">
                  ID: {user.id.substring(0, 8)}...
                </Badge>
              </CardHeader>

              <CardContent className="text-center text-xs text-muted-foreground">
                <p>Créé le {formatDate(user.createdAt)}</p>
                {user.updatedAt !== user.createdAt && (
                  <p>Modifié le {formatDate(user.updatedAt)}</p>
                )}
              </CardContent>

              <CardFooter className="flex gap-2 pt-2">
                <Dialog open={isEditDialogOpen && editingUser?.id === user.id} 
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open)
                          if (!open) setEditingUser(null)
                        }}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Modifier l'utilisateur (DynamoDB)</DialogTitle>
                    </DialogHeader>
                    {editingUser && (
                      <DynamoUserForm 
                        user={editingUser} 
                        onSuccess={handleSuccess}
                        onCancel={() => {
                          setIsEditDialogOpen(false)
                          setEditingUser(null)
                        }}
                      />
                    )}
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="flex-1"
                      disabled={deletingUserId === user.id}
                    >
                      {deletingUserId === user.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer l'utilisateur "{user.name}" de DynamoDB ? 
                        Cette action est irréversible et supprimera également sa photo de profil de S3.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(user.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 
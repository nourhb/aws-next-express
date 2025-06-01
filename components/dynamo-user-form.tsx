"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, Database } from "lucide-react"

interface DynamoUser {
  id: string
  name: string
  email: string
  profilePictureUrl: string
  createdAt: string
  updatedAt: string
}

interface DynamoUserFormProps {
  user?: DynamoUser
  onSuccess?: () => void
  onCancel?: () => void
}

export function DynamoUserForm({ user, onSuccess, onCancel }: DynamoUserFormProps) {
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profilePictureUrl || null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const isEditing = !!user

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setPreviewUrl(user.profilePictureUrl)
    }
  }, [user])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfilePicture(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    if (!isEditing && !profilePicture) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une photo de profil",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("email", email)
      
      if (profilePicture) {
        formData.append("profilePicture", profilePicture)
      }

      const url = isEditing ? `/api/dynamo-users/${user.id}` : "/api/dynamo-users"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: formData,
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Erreur lors de l'opération")
      }

      toast({
        title: "Succès",
        description: `L'utilisateur a été ${isEditing ? 'mis à jour' : 'ajouté'} avec succès dans DynamoDB`,
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/users")
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Erreur",
        description: error.message || `Une erreur est survenue lors de ${isEditing ? 'la mise à jour' : 'l\'ajout'} de l'utilisateur`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.back()
    }
  }

  return (
    <Card className="max-w-2xl mx-auto border-orange-200 dark:border-orange-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-orange-600" />
          {isEditing ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
          <Badge variant="outline" className="ml-auto">DynamoDB</Badge>
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Database Info */}
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
            <Database className="h-4 w-4 text-orange-600" />
            <p className="text-sm text-orange-800 dark:text-orange-200">
              Les données seront stockées dans Amazon DynamoDB (NoSQL)
            </p>
          </div>

          {/* Profile Picture Preview */}
          {previewUrl && (
            <div className="flex justify-center">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={previewUrl} alt="Profile preview" />
                <AvatarFallback className="text-lg">
                  {name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          {/* User ID for editing */}
          {isEditing && user && (
            <div className="space-y-2">
              <Label>ID DynamoDB</Label>
              <div className="flex items-center gap-2">
                <Input value={user.id} disabled className="font-mono text-xs" />
                <Badge variant="outline">UUID</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Identifiant unique généré automatiquement par DynamoDB
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Entrez le nom complet"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez l'email"
                required
              />
              {isEditing && (
                <p className="text-xs text-muted-foreground">
                  DynamoDB vérifie l'unicité via Global Secondary Index
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profilePicture">
              Photo de profil {!isEditing && "*"}
            </Label>
            <div className="flex items-center gap-4">
              <Input 
                id="profilePicture" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                required={!isEditing}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Choisir
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Stockée dans AWS S3, URL enregistrée dans DynamoDB
              {isEditing && " - Laissez vide pour conserver la photo actuelle"}
            </p>
          </div>

          {/* Timestamps for editing */}
          {isEditing && user && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs">Créé le</Label>
                <p className="text-muted-foreground">
                  {new Date(user.createdAt).toLocaleString('fr-FR')}
                </p>
              </div>
              <div>
                <Label className="text-xs">Modifié le</Label>
                <p className="text-muted-foreground">
                  {new Date(user.updatedAt).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel} 
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Mise à jour..." : "Ajout..."}
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                {isEditing ? "Mettre à jour" : "Ajouter à DynamoDB"}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
} 
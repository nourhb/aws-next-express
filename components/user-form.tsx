"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  profilePictureUrl: string
  createdAt: string
  updatedAt: string
}

interface UserFormProps {
  user?: User
  onSuccess?: () => void
  onCancel?: () => void
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
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
      if (isEditing) {
        // Update user
        const updateData: any = { name, email }
        
        if (profilePicture) {
          const formData = new FormData()
          formData.append("name", name)
          formData.append("email", email)
          formData.append("profilePicture", profilePicture)

          const response = await fetch(`/api/users/${user.id}`, {
            method: "PUT",
            body: formData,
          })

          if (!response.ok) {
            throw new Error("Erreur lors de la mise à jour de l'utilisateur")
          }
        } else {
          const response = await fetch(`/api/users/${user.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          })

          if (!response.ok) {
            throw new Error("Erreur lors de la mise à jour de l'utilisateur")
          }
        }

        toast({
          title: "Succès",
          description: "L'utilisateur a été mis à jour avec succès",
        })

        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/users")
        }
      } else {
        // Create new user
        const formData = new FormData()
        formData.append("name", name)
        formData.append("email", email)
        formData.append("profilePicture", profilePicture!)

        const response = await fetch("/api/users", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Erreur lors de l'ajout de l'utilisateur")
        }

        toast({
          title: "Succès",
          description: "L'utilisateur a été ajouté avec succès",
        })

        router.push("/users")
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Erreur",
        description: `Une erreur est survenue lors de ${isEditing ? 'la mise à jour' : 'l\'ajout'} de l'utilisateur`,
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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
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
            {isEditing && (
              <p className="text-xs text-muted-foreground">
                Laissez vide pour conserver la photo actuelle
              </p>
            )}
          </div>
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
              isEditing ? "Mettre à jour" : "Ajouter l'utilisateur"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

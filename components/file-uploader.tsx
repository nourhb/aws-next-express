"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload } from "lucide-react"

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'upload du fichier")
      }

      toast({
        title: "Succès",
        description: "Le fichier a été uploadé avec succès",
      })

      // Reset form
      setFile(null)
      const fileInput = document.getElementById("file") as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }

      // Trigger refresh of file list
      window.dispatchEvent(new CustomEvent("fileUploaded"))
    } catch (error) {
      console.error(error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploader un fichier</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Sélectionner un fichier</Label>
            <Input id="file" type="file" onChange={handleFileChange} disabled={isUploading} />
          </div>

          {file && (
            <div className="text-sm">
              <p>
                <span className="font-medium">Nom:</span> {file.name}
              </p>
              <p>
                <span className="font-medium">Taille:</span> {(file.size / 1024).toFixed(2)} KB
              </p>
              <p>
                <span className="font-medium">Type:</span> {file.type || "Inconnu"}
              </p>
            </div>
          )}

          <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Uploader le fichier
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

import { UserForm } from "@/components/user-form"

export default function NewUserPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Ajouter un nouvel utilisateur</h1>
      <UserForm />
    </div>
  )
}

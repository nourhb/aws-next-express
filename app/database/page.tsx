import { DatabaseSelector } from "@/components/database-selector"

export default function DatabasePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          🚀 AWS Next Express
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Application complète avec support des bases de données <strong>RDS MySQL</strong> et <strong>DynamoDB</strong>
        </p>
        <p className="text-muted-foreground">
          Stockage de fichiers avec <strong>AWS S3</strong> • Interface moderne avec <strong>Next.js 15</strong> • 
          Containerisation <strong>Docker</strong> • Orchestration <strong>Kubernetes</strong>
        </p>
      </div>

      <DatabaseSelector />
    </div>
  )
} 
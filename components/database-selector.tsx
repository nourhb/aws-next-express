"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Server, Cloud, Info } from "lucide-react"
import { UserList } from "./user-list"
import { DynamoUserList } from "./dynamo-user-list"
import { FileList } from "./file-list"
import { DynamoFileList } from "./dynamo-file-list"

type DatabaseType = "rds" | "dynamodb"
type ContentType = "users" | "files"

export function DatabaseSelector() {
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseType>("rds")
  const [contentType, setContentType] = useState<ContentType>("users")

  return (
    <div className="space-y-6">
      {/* Database Selection Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Sélection de Base de Données
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card 
              className={`cursor-pointer transition-all ${
                selectedDatabase === 'rds' 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedDatabase('rds')}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <Server className="h-8 w-8 text-blue-600" />
                <div className="flex-1">
                  <h3 className="font-semibold">Amazon RDS (MySQL)</h3>
                  <p className="text-sm text-muted-foreground">
                    Base de données relationnelle avec Prisma ORM
                  </p>
                </div>
                {selectedDatabase === 'rds' && (
                  <Badge variant="default">Actif</Badge>
                )}
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all ${
                selectedDatabase === 'dynamodb' 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedDatabase('dynamodb')}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <Cloud className="h-8 w-8 text-orange-600" />
                <div className="flex-1">
                  <h3 className="font-semibold">Amazon DynamoDB</h3>
                  <p className="text-sm text-muted-foreground">
                    Base de données NoSQL haute performance
                  </p>
                </div>
                {selectedDatabase === 'dynamodb' && (
                  <Badge variant="default">Actif</Badge>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <Info className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Base actuelle:</strong> {selectedDatabase === 'rds' ? 'Amazon RDS MySQL' : 'Amazon DynamoDB'}
              {" - "}Les données sont stockées séparément dans chaque base.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">👥 Utilisateurs</TabsTrigger>
          <TabsTrigger value="files">📁 Fichiers</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Gestion des Utilisateurs</span>
                <Badge variant="outline">
                  {selectedDatabase === 'rds' ? 'RDS MySQL' : 'DynamoDB'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDatabase === 'rds' ? (
                <UserList />
              ) : (
                <DynamoUserList />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Gestion des Fichiers</span>
                <Badge variant="outline">
                  S3 + {selectedDatabase === 'rds' ? 'Métadonnées en mémoire' : 'DynamoDB'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDatabase === 'rds' ? (
                <FileList />
              ) : (
                <DynamoFileList />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Features Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Comparaison des Fonctionnalités</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-blue-600">🗄️ Amazon RDS (MySQL)</h4>
              <ul className="space-y-2 text-sm">
                <li>✅ Relations entre tables</li>
                <li>✅ Transactions ACID</li>
                <li>✅ Requêtes SQL complexes</li>
                <li>✅ Intégration Prisma ORM</li>
                <li>✅ Auto-increment IDs</li>
                <li>✅ Contraintes de données</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-orange-600">☁️ Amazon DynamoDB</h4>
              <ul className="space-y-2 text-sm">
                <li>✅ Performance élevée</li>
                <li>✅ Scalabilité automatique</li>
                <li>✅ Pas de gestion de serveur</li>
                <li>✅ Global Secondary Indexes</li>
                <li>✅ UUID comme clés</li>
                <li>✅ Eventual consistency</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
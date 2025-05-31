"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  FileText, 
  Plus, 
  TrendingUp, 
  Activity,
  Database,
  Cloud,
  BarChart3,
  ArrowRight
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  profilePictureUrl: string
  createdAt: string
}

interface DashboardStats {
  totalUsers: number
  recentUsers: User[]
  systemStatus: {
    database: boolean
    storage: boolean
    api: boolean
  }
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    recentUsers: [],
    systemStatus: { database: true, storage: true, api: true }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const users = await response.json()
        setStats({
          totalUsers: users.length,
          recentUsers: users.slice(0, 3),
          systemStatus: { database: true, storage: true, api: true }
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setStats(prev => ({
        ...prev,
        systemStatus: { database: false, storage: true, api: false }
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AWS Next Express
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Gestionnaire de fichiers et utilisateurs avec DynamoDB, S3 et orchestration Kubernetes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.recentUsers.length} récemment ajoutés
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statut Base de Données</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={stats.systemStatus.database ? "default" : "destructive"}>
                {stats.systemStatus.database ? "Connecté" : "Déconnecté"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">DynamoDB Local</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stockage</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={stats.systemStatus.storage ? "default" : "destructive"}>
                {stats.systemStatus.storage ? "Opérationnel" : "Indisponible"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">AWS S3</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={stats.systemStatus.api ? "default" : "destructive"}>
                {stats.systemStatus.api ? "Actif" : "Erreur"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">REST API</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-500" />
              <CardTitle>Gestion des Utilisateurs</CardTitle>
            </div>
            <CardDescription>
              Gérez les utilisateurs avec DynamoDB - CRUD complet avec upload de photos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Utilisateurs totaux</span>
              <Badge variant="secondary">{stats.totalUsers}</Badge>
            </div>
            <div className="flex gap-2">
              <Link href="/users" className="flex-1">
                <Button className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Voir les utilisateurs
                </Button>
              </Link>
              <Link href="/users/new">
                <Button variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-green-500" />
              <CardTitle>Gestion des Fichiers</CardTitle>
            </div>
            <CardDescription>
              Upload et gestion de fichiers avec AWS S3 - Stockage sécurisé dans le cloud
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Stockage</span>
              <Badge variant="secondary">AWS S3</Badge>
            </div>
            <Link href="/files">
              <Button className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Gérer les fichiers
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      {stats.recentUsers.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Utilisateurs Récents
                </CardTitle>
                <CardDescription>
                  Les derniers utilisateurs ajoutés au système
                </CardDescription>
              </div>
              <Link href="/users">
                <Button variant="outline" size="sm">
                  Voir tous
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.profilePictureUrl} alt={user.name} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technology Stack */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Stack Technologique
          </CardTitle>
          <CardDescription>
            Architecture moderne avec containerisation et orchestration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-background/50">
              <div className="font-medium">Frontend</div>
              <div className="text-sm text-muted-foreground">Next.js 15</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <div className="font-medium">Base de Données</div>
              <div className="text-sm text-muted-foreground">DynamoDB</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <div className="font-medium">Stockage</div>
              <div className="text-sm text-muted-foreground">AWS S3</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <div className="font-medium">Orchestration</div>
              <div className="text-sm text-muted-foreground">Kubernetes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

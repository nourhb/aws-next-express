"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Database, 
  Server, 
  Cloud, 
  Info, 
  Zap, 
  Sparkles,
  TrendingUp,
  Users,
  FileText,
  GitBranch,
  Activity,
  Star,
  Globe,
  Shield,
  Cpu,
  HardDrive
} from "lucide-react"
import { UserList } from "./user-list"
import { DynamoUserList } from "./dynamo-user-list"
import { FileList } from "./file-list"
import { DynamoFileList } from "./dynamo-file-list"
import { ThemeToggle } from "./theme-toggle"
import { MetricsDashboard } from "./metrics-dashboard"
import { DatabaseLoading, SkeletonCard } from "./loading-states"

type DatabaseType = "rds" | "dynamodb"
type ContentType = "users" | "files" | "metrics"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
}

const glowVariants = {
  initial: { scale: 1, opacity: 0.5 },
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export function DatabaseSelector() {
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseType>("rds")
  const [contentType, setContentType] = useState<ContentType>("users")
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{ rds: boolean; dynamodb: boolean }>({
    rds: false,
    dynamodb: false
  })

  // Simulate connection status
  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionStatus({ rds: true, dynamodb: true })
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleDatabaseChange = (database: DatabaseType) => {
    setIsLoading(true)
    setTimeout(() => {
      setSelectedDatabase(database)
      setIsLoading(false)
    }, 800)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Animated Header */}
      <motion.div variants={itemVariants} className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 blur-3xl -z-10" />
        <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
          <CardHeader className="text-center relative">
            {/* Theme Toggle */}
            <div className="absolute top-4 right-4">
              <ThemeToggle />
            </div>

            {/* Animated logo/icon */}
            <motion.div
              className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary via-purple-500 to-primary/80 flex items-center justify-center mb-4 relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                variants={glowVariants}
                initial="initial"
                animate="animate"
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/50 to-purple-500/50 blur-lg"
              />
              <Database className="h-10 w-10 text-primary-foreground relative z-10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent mb-2">
                🚀 AWS Next Express
              </CardTitle>
              <p className="text-xl text-muted-foreground mb-4">
                Architecture Dual-Database Révolutionnaire
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {["Next.js 15", "TypeScript", "AWS", "Docker", "Kubernetes"].map((tech, index) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Badge variant="secondary" className="bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-all">
                      {tech}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Database Selection */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Sélection de Base de Données
              <Badge variant="outline" className="ml-auto">
                Dual Architecture
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* RDS MySQL Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <Card 
                  className={`cursor-pointer transition-all duration-500 border-2 ${
                    selectedDatabase === 'rds' 
                    ? 'ring-4 ring-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20 border-blue-500 shadow-xl shadow-blue-500/20' 
                    : 'hover:shadow-lg hover:border-blue-300 border-muted'
                  }`}
                  onClick={() => handleDatabaseChange('rds')}
                >
                  <CardContent className="p-6 relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <motion.div
                          className="p-3 rounded-full bg-blue-500/20"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Server className="h-8 w-8 text-blue-600" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400">
                            Amazon RDS MySQL
                          </h3>
                          <p className="text-sm text-blue-600/80 dark:text-blue-300/80">
                            Base de données relationnelle avec Prisma ORM
                          </p>
                        </div>
                        {selectedDatabase === 'rds' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2"
                          >
                            <Badge variant="default" className="bg-blue-500">
                              <Star className="h-3 w-3 mr-1" />
                              Actif
                            </Badge>
                          </motion.div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {[
                          { icon: Shield, label: "ACID", color: "text-green-600" },
                          { icon: GitBranch, label: "Relations", color: "text-blue-600" },
                          { icon: Zap, label: "SQL", color: "text-yellow-600" },
                          { icon: TrendingUp, label: "Scalable", color: "text-purple-600" },
                        ].map((feature) => (
                          <motion.div
                            key={feature.label}
                            className="flex items-center gap-2"
                            whileHover={{ x: 5 }}
                          >
                            <feature.icon className={`h-4 w-4 ${feature.color}`} />
                            <span className="text-xs font-medium">{feature.label}</span>
                          </motion.div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Performance</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-1" />
                      </div>
                    </div>

                    {/* Connection status */}
                    <motion.div 
                      className="absolute top-2 right-2"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className={`w-3 h-3 rounded-full ${connectionStatus.rds ? 'bg-green-500' : 'bg-red-500'}`} />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* DynamoDB Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <Card 
                  className={`cursor-pointer transition-all duration-500 border-2 ${
                    selectedDatabase === 'dynamodb' 
                    ? 'ring-4 ring-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20 border-orange-500 shadow-xl shadow-orange-500/20' 
                    : 'hover:shadow-lg hover:border-orange-300 border-muted'
                  }`}
                  onClick={() => handleDatabaseChange('dynamodb')}
                >
                  <CardContent className="p-6 relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <motion.div
                          className="p-3 rounded-full bg-orange-500/20"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Cloud className="h-8 w-8 text-orange-600" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-orange-700 dark:text-orange-400">
                            Amazon DynamoDB
                          </h3>
                          <p className="text-sm text-orange-600/80 dark:text-orange-300/80">
                            Base de données NoSQL haute performance
                          </p>
                        </div>
                        {selectedDatabase === 'dynamodb' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2"
                          >
                            <Badge variant="default" className="bg-orange-500">
                              <Star className="h-3 w-3 mr-1" />
                              Actif
                            </Badge>
                          </motion.div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {[
                          { icon: Zap, label: "Ultra-Fast", color: "text-yellow-600" },
                          { icon: Globe, label: "Global", color: "text-blue-600" },
                          { icon: Cpu, label: "NoSQL", color: "text-green-600" },
                          { icon: HardDrive, label: "Serverless", color: "text-purple-600" },
                        ].map((feature) => (
                          <motion.div
                            key={feature.label}
                            className="flex items-center gap-2"
                            whileHover={{ x: 5 }}
                          >
                            <feature.icon className={`h-4 w-4 ${feature.color}`} />
                            <span className="text-xs font-medium">{feature.label}</span>
                          </motion.div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Performance</span>
                          <span>95%</span>
                        </div>
                        <Progress value={95} className="h-1" />
                      </div>
                    </div>

                    {/* Connection status */}
                    <motion.div 
                      className="absolute top-2 right-2"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className={`w-3 h-3 rounded-full ${connectionStatus.dynamodb ? 'bg-green-500' : 'bg-red-500'}`} />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Status Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
                selectedDatabase === 'rds' 
                ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' 
                : 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'
              }`}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Info className={`h-5 w-5 ${selectedDatabase === 'rds' ? 'text-blue-600' : 'text-orange-600'}`} />
              </motion.div>
              <p className={`text-sm font-medium ${
                selectedDatabase === 'rds' 
                ? 'text-blue-800 dark:text-blue-200' 
                : 'text-orange-800 dark:text-orange-200'
              }`}>
                <strong>Base actuelle:</strong> {selectedDatabase === 'rds' ? 'Amazon RDS MySQL' : 'Amazon DynamoDB'}
                {" - "}Architecture {selectedDatabase === 'rds' ? 'relationnelle avec Prisma ORM' : 'NoSQL avec SDK AWS natif'}
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Fichiers
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Métriques
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="users" className="space-y-4">
              <motion.div
                key="users"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Gestion des Utilisateurs
                      </span>
                      <Badge variant="outline" className="animate-pulse">
                        {selectedDatabase === 'rds' ? 'RDS MySQL' : 'DynamoDB'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <DatabaseLoading type={selectedDatabase === 'rds' ? 'mysql' : 'dynamodb'} />
                    ) : selectedDatabase === 'rds' ? (
                      <UserList />
                    ) : (
                      <DynamoUserList />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="files" className="space-y-4">
              <motion.div
                key="files"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Gestion des Fichiers
                      </span>
                      <Badge variant="outline" className="animate-pulse">
                        S3 + {selectedDatabase === 'rds' ? 'Métadonnées en mémoire' : 'DynamoDB'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <DatabaseLoading type={selectedDatabase === 'rds' ? 'mysql' : 'dynamodb'} />
                    ) : selectedDatabase === 'rds' ? (
                      <FileList />
                    ) : (
                      <DynamoFileList />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <motion.div
                key="metrics"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <MetricsDashboard />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </motion.div>
  )
} 
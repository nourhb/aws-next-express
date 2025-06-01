"use client"

import { motion } from "framer-motion"
import { Loader2, Database, Cloud, Server } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

// Skeleton components
export function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-4">
          <motion.div
            className="h-12 w-12 rounded-full bg-muted"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="space-y-2 flex-1">
            <motion.div
              className="h-4 bg-muted rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="h-3 bg-muted rounded w-3/4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <motion.div
            className="h-3 bg-muted rounded"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          />
          <motion.div
            className="h-3 bg-muted rounded w-5/6"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
          />
          <motion.div
            className="h-3 bg-muted rounded w-4/6"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

// Database loading animation
export function DatabaseLoading({ type = "mysql" }: { type?: "mysql" | "dynamodb" }) {
  const icon = type === "mysql" ? Server : Cloud
  const color = type === "mysql" ? "text-blue-500" : "text-orange-500"
  const bgColor = type === "mysql" ? "bg-blue-500/10" : "bg-orange-500/10"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center space-y-4 p-8"
    >
      <div className={`relative p-4 rounded-full ${bgColor}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Database className={`h-8 w-8 ${color}`} />
        </motion.div>
        
        {/* Pulse rings */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`absolute inset-0 rounded-full border-2 ${color.replace('text-', 'border-')}`}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 2 + i * 0.5, opacity: 0 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: i * 0.4,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
      
      <div className="text-center space-y-2">
        <motion.p
          className="font-semibold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Connexion à {type === "mysql" ? "MySQL" : "DynamoDB"}...
        </motion.p>
        <div className="flex items-center justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')}`}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// File upload progress
export function FileUploadLoading({ progress = 0 }: { progress?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-6"
    >
      <div className="flex items-center space-x-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-6 w-6 text-primary" />
        </motion.div>
        <div className="flex-1">
          <p className="font-medium">Upload en cours...</p>
          <p className="text-sm text-muted-foreground">
            {progress}% terminé
          </p>
        </div>
      </div>
      
      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/80"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: [-100, 300] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </motion.div>
  )
}

// Spinner with different variants
export function Spinner({ 
  size = "default", 
  variant = "default" 
}: { 
  size?: "sm" | "default" | "lg"
  variant?: "default" | "dots" | "pulse" | "bounce"
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  if (variant === "dots") {
    return (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${sizeClasses[size]} bg-primary rounded-full`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <motion.div
        className={`${sizeClasses[size]} bg-primary rounded-full`}
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    )
  }

  if (variant === "bounce") {
    return (
      <motion.div
        className={`${sizeClasses[size]} bg-primary rounded-full`}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    )
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 className={`${sizeClasses[size]} text-primary`} />
    </motion.div>
  )
}

// Full page loading
export function FullPageLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-6"
      >
        {/* Logo or icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center"
        >
          <Database className="h-8 w-8 text-primary-foreground" />
        </motion.div>

        {/* Loading text */}
        <div className="space-y-2">
          <motion.h2
            className="text-2xl font-bold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            AWS Next Express
          </motion.h2>
          <motion.p
            className="text-muted-foreground"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            Chargement de l'application...
          </motion.p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
} 
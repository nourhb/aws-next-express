"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Database, Sparkles, Zap, Globe, Cloud, Server } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Particle component
const Particle = ({ delay, duration, x, y }: { delay: number; duration: number; x: number; y: number }) => {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-primary/30 rounded-full"
      initial={{ 
        x: x, 
        y: y, 
        opacity: 0,
        scale: 0 
      }}
      animate={{
        x: [x, x + Math.random() * 100 - 50],
        y: [y, y + Math.random() * 100 - 50],
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}

// Floating icon component
const FloatingIcon = ({ 
  icon: Icon, 
  className, 
  delay, 
  color 
}: { 
  icon: any; 
  className: string; 
  delay: number; 
  color: string;
}) => {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ 
        opacity: [0.3, 0.8, 0.3], 
        scale: [0.8, 1.2, 0.8],
        rotate: [0, 360],
        y: [0, -20, 0]
      }}
      transition={{
        duration: 6,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className={`p-3 rounded-full ${color} backdrop-blur-sm border border-white/20`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </motion.div>
  )
}

export function HeroHeader() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; duration: number }>>([])

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 800,
      y: Math.random() * 400,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4
    }))
    setParticles(newParticles)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
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

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Simplified dotted pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            x={particle.x}
            y={particle.y}
            delay={particle.delay}
            duration={particle.duration}
          />
        ))}
      </div>

      {/* Floating icons */}
      <FloatingIcon 
        icon={Database} 
        className="top-20 left-20" 
        delay={0} 
        color="bg-blue-500/20" 
      />
      <FloatingIcon 
        icon={Server} 
        className="top-32 right-32" 
        delay={1} 
        color="bg-green-500/20" 
      />
      <FloatingIcon 
        icon={Cloud} 
        className="bottom-32 left-32" 
        delay={2} 
        color="bg-orange-500/20" 
      />
      <FloatingIcon 
        icon={Globe} 
        className="bottom-20 right-20" 
        delay={3} 
        color="bg-purple-500/20" 
      />

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Logo/Icon */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <motion.div
            className="mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center mb-6 relative"
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              boxShadow: "0 0 50px rgba(139, 92, 246, 0.5)"
            }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 40px rgba(139, 92, 246, 0.5)",
                "0 0 20px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Database className="h-16 w-16 text-white" />
            </motion.div>
            
            {/* Orbital rings */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute border-2 border-white/20 rounded-full"
                style={{
                  width: `${120 + ring * 20}px`,
                  height: `${120 + ring * 20}px`,
                  top: `${-10 - ring * 10}px`,
                  left: `${-10 - ring * 10}px`
                }}
                animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
                transition={{
                  duration: 10 + ring * 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div variants={itemVariants} className="mb-6">
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-4"
            variants={textVariants}
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AWS
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Next Express
            </span>
          </motion.h1>
          
          <motion.div
            variants={textVariants}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles className="h-6 w-6 text-yellow-400" />
            <span className="text-xl md:text-2xl text-gray-300 font-medium">
              Architecture Dual-Database Révolutionnaire
            </span>
            <Sparkles className="h-6 w-6 text-yellow-400" />
          </motion.div>
        </motion.div>

        {/* Description */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.p
            variants={textVariants}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Découvrez une application Next.js 15 moderne avec support complet pour{" "}
            <span className="text-blue-400 font-semibold">Amazon RDS MySQL</span> et{" "}
            <span className="text-orange-400 font-semibold">DynamoDB</span>,
            intégration AWS S3, containerisation Docker et orchestration Kubernetes.
          </motion.p>
        </motion.div>

        {/* Tech Stack Badges */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div 
            className="flex flex-wrap justify-center gap-3"
            variants={containerVariants}
          >
            {[
              { name: "Next.js 15", color: "bg-black/20 text-white border-gray-600" },
              { name: "TypeScript", color: "bg-blue-500/20 text-blue-300 border-blue-500" },
              { name: "AWS", color: "bg-orange-500/20 text-orange-300 border-orange-500" },
              { name: "Docker", color: "bg-blue-600/20 text-blue-300 border-blue-600" },
              { name: "Kubernetes", color: "bg-purple-500/20 text-purple-300 border-purple-500" },
              { name: "Prisma", color: "bg-green-500/20 text-green-300 border-green-500" },
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.1,
                  y: -5,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge 
                  variant="outline" 
                  className={`text-sm px-4 py-2 backdrop-blur-sm ${tech.color}`}
                >
                  {tech.name}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl border-0 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Explorer l'Application
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Bottom info */}
        <motion.div variants={itemVariants} className="mt-12">
          <motion.p
            variants={textVariants}
            className="text-gray-500 text-sm"
          >
            Développé par{" "}
            <span className="text-purple-400 font-semibold">Nour el houda Bouajila</span> &{" "}
            <span className="text-blue-400 font-semibold">Ghofrane Nasri</span>
            <br />
            <span className="text-yellow-400">🎓 ITEAM University</span>
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
} 
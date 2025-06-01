"use client"

import { motion } from "framer-motion"
import { HeroHeader } from "@/components/hero-header"
import { DatabaseSelector } from "@/components/database-selector"
import { Button } from "@/components/ui/button"
import { ArrowDown, Github, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const scrollToDatabase = () => {
    document.getElementById('database-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="hero">
        <div className="relative">
          <HeroHeader />
          
          {/* Call to action overlay */}
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              <Button
                onClick={scrollToDatabase}
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-2xl"
              >
                <ArrowDown className="h-5 w-5 mr-2" />
                Découvrir l'Architecture
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Database Section */}
      <section id="database-section" className="relative min-h-screen py-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-background to-background" />
        
        <div className="relative z-10 container mx-auto px-6">
          <DatabaseSelector />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gradient">
              🚀 Fonctionnalités Exceptionnelles
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Une architecture moderne qui repousse les limites du développement full-stack
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🗄️",
                title: "Dual Database",
                description: "Support complet RDS MySQL et DynamoDB avec interface de sélection",
                color: "from-blue-500 to-purple-500"
              },
              {
                icon: "⚡",
                title: "Performance Ultra",
                description: "Optimisations avancées, animations fluides et loading states intelligents",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: "🐳",
                title: "Containerisation",
                description: "Docker Compose complet avec 7 services et orchestration Kubernetes",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: "🔄",
                title: "CI/CD Pipeline",
                description: "GitHub Actions, ArgoCD et déploiement GitOps automatisé",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: "🛡️",
                title: "Sécurité Avancée",
                description: "Authentication, autorisations IAM et chiffrement des données",
                color: "from-red-500 to-pink-500"
              },
              {
                icon: "📊",
                title: "Monitoring",
                description: "Métriques en temps réel, dashboards et alertes intelligentes",
                color: "from-purple-500 to-indigo-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group"
              >
                <div className="bg-card border border-border rounded-xl p-6 h-full card-hover group-hover:border-primary/50 transition-all duration-300">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gradient">
              📊 Métriques Impressionnantes
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "15K+", label: "Lignes de Code", icon: "💻" },
              { number: "80+", label: "Fichiers", icon: "📁" },
              { number: "25+", label: "Composants", icon: "🧩" },
              { number: "12", label: "APIs", icon: "🔌" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <motion.div
                  className="text-4xl font-bold text-primary mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-gradient">
              🎓 Projet ITEAM University
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Découvrez une application complète développée par nos étudiants, 
              démontrant l'excellence technique et l'innovation dans le développement moderne.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                "✅ Toutes les exigences satisfaites",
                "🚀 Fonctionnalités bonus avancées", 
                "📱 Interface moderne et responsive",
                "🛡️ Prêt pour la production"
              ].map((point, index) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Badge variant="secondary" className="text-sm px-4 py-2">
                    {point}
                  </Badge>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  onClick={scrollToDatabase}
                  className="btn-gradient"
                >
                  🚀 Explorer l'Application
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => window.open('https://github.com/nourhb/aws-next-express', '_blank')}
                >
                  <Github className="h-5 w-5 mr-2" />
                  Code Source
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/50 border-t">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-xl font-bold">AWS Next Express</span>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Développé avec ❤️ par{" "}
              <span className="text-primary font-semibold">Nour el houda Bouajila</span> et{" "}
              <span className="text-primary font-semibold">Ghofrane Nasri</span>
            </p>
            
            <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
              <span>🎓 ITEAM University</span>
              <span>•</span>
              <span>🚀 Next.js 15</span>
              <span>•</span>
              <span>☁️ AWS Architecture</span>
              <span>•</span>
              <span>🐳 Docker & Kubernetes</span>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

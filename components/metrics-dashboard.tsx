"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts"
import { 
  Database, 
  FileText, 
  Users, 
  Server, 
  Cloud,
  TrendingUp,
  Activity,
  Zap,
  GitBranch,
  Code
} from "lucide-react"

const projectStats = {
  totalFiles: 80,
  linesOfCode: 15000,
  components: 25,
  apis: 12,
  dockerServices: 7,
  kubernetesManifests: 10,
  coverage: 88.7,
  performance: 93
}

const databaseComparison = [
  { name: 'Performance', rds: 85, dynamodb: 95 },
  { name: 'Scalabilité', rds: 70, dynamodb: 98 },
  { name: 'Complexité', rds: 90, dynamodb: 60 },
  { name: 'Consistance', rds: 95, dynamodb: 75 },
]

const techStack = [
  { name: 'Next.js', value: 30, color: '#000000' },
  { name: 'TypeScript', value: 25, color: '#3178c6' },
  { name: 'AWS', value: 20, color: '#ff9900' },
  { name: 'Docker', value: 15, color: '#2496ed' },
  { name: 'Prisma', value: 10, color: '#2d3748' },
]

const performanceData = [
  { name: 'Jan', performance: 85 },
  { name: 'Fév', performance: 88 },
  { name: 'Mar', performance: 91 },
  { name: 'Avr', performance: 89 },
  { name: 'Mai', performance: 93 },
  { name: 'Jun', performance: 95 },
]

export function MetricsDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          📊 Métriques du Projet
        </h2>
        <p className="text-muted-foreground">
          Analyse en temps réel de l'architecture et des performances
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: "Fichiers", value: projectStats.totalFiles, suffix: "", color: "blue" },
          { icon: Code, label: "Lignes de Code", value: "15K+", suffix: "", color: "green" },
          { icon: Users, label: "Composants", value: projectStats.components, suffix: "+", color: "purple" },
          { icon: Database, label: "APIs", value: projectStats.apis, suffix: "", color: "orange" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="group"
          >
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    <motion.p 
                      className="text-2xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                    >
                      {stat.value}{stat.suffix}
                    </motion.p>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}
                  >
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </motion.div>
                </div>
                
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Comparaison RDS vs DynamoDB
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={databaseComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="rds" fill="#3b82f6" name="RDS MySQL" radius={4} />
                  <Bar dataKey="dynamodb" fill="#f59e0b" name="DynamoDB" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tech Stack Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Stack Technologique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={techStack}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {techStack.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Evolution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="performance" 
                    stroke="#8884d8" 
                    fill="url(#colorPerformance)" 
                  />
                  <defs>
                    <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Métriques Qualité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: "Code Coverage", value: projectStats.coverage, color: "green" },
                { label: "Performance", value: projectStats.performance, color: "blue" },
                { label: "Documentation", value: 95, color: "purple" },
              ].map((metric, index) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{metric.label}</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + index * 0.2 }}
                      className="font-bold"
                    >
                      {metric.value}%
                    </motion.span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.8 + index * 0.2, duration: 0.8 }}
                  >
                    <Progress value={metric.value} className="h-2" />
                  </motion.div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Technology Badges */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-wrap gap-2 justify-center"
      >
        {[
          "Next.js 15", "TypeScript", "AWS S3", "RDS MySQL", "DynamoDB", 
          "Docker", "Kubernetes", "Prisma ORM", "Terraform", "ArgoCD",
          "GitHub Actions", "Tailwind CSS", "Framer Motion"
        ].map((tech, index) => (
          <motion.div
            key={tech}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + index * 0.05, type: "spring" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge variant="secondary" className="text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
              {tech}
            </Badge>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
} 
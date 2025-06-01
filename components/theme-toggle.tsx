"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Monitor, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "./theme-provider"

const themes = [
  { name: "light", icon: Sun, label: "Clair" },
  { name: "dark", icon: Moon, label: "Sombre" },
  { name: "system", icon: Monitor, label: "Système" },
] as const

const colorThemes = [
  { name: "blue", color: "bg-blue-500", label: "Bleu" },
  { name: "purple", color: "bg-purple-500", label: "Violet" },
  { name: "green", color: "bg-green-500", label: "Vert" },
  { name: "orange", color: "bg-orange-500", label: "Orange" },
  { name: "pink", color: "bg-pink-500", label: "Rose" },
] as const

export function ThemeToggle() {
  const { theme, colorTheme, setTheme, setColorTheme } = useTheme()

  const currentTheme = themes.find(t => t.name === theme) || themes[0]
  const currentColorTheme = colorThemes.find(c => c.name === colorTheme) || colorThemes[0]

  return (
    <div className="flex items-center gap-2">
      {/* Theme Toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative overflow-hidden group">
            <motion.div
              key={theme}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <currentTheme.icon className="h-4 w-4" />
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-primary/10 rounded-lg"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            />
            <span className="sr-only">Changer le thème</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Apparence</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {themes.map((themeOption) => {
            const Icon = themeOption.icon
            return (
              <DropdownMenuItem
                key={themeOption.name}
                onClick={() => setTheme(themeOption.name)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.div>
                  <span>{themeOption.label}</span>
                  {theme === themeOption.name && (
                    <motion.div
                      layoutId="theme-indicator"
                      className="ml-auto w-2 h-2 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Color Theme Toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative overflow-hidden group">
            <motion.div
              key={colorTheme}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Palette className="h-4 w-4" />
            </motion.div>
            <motion.div
              className={`absolute inset-0 ${currentColorTheme.color} opacity-20 rounded-lg`}
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            />
            <span className="sr-only">Changer la couleur</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Couleur du thème</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {colorThemes.map((colorOption) => (
            <DropdownMenuItem
              key={colorOption.name}
              onClick={() => setColorTheme(colorOption.name)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-4 h-4 rounded-full ${colorOption.color}`}
                />
                <span>{colorOption.label}</span>
                {colorTheme === colorOption.name && (
                  <motion.div
                    layoutId="color-indicator"
                    className="ml-auto w-2 h-2 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 
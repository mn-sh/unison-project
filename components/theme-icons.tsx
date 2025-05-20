import { Moon, Sun } from "lucide-react"

interface ThemeIconProps {
  theme: string
  className?: string
}

// Simplify the ThemeIcon component
export const ThemeIcon = ({ theme, className = "w-4 h-4" }: ThemeIconProps) => {
  switch (theme) {
    case "dark":
      return <Moon className={className} />
    default:
      return <Sun className={className} />
  }
}

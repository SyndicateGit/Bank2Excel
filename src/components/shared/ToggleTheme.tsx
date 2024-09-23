import { useTheme } from 'next-themes';
import React from 'react'
import { Button } from '../ui/button';
import { Moon, Sun } from 'lucide-react';

const ToggleTheme = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <>
      <Button variant="outline" size="icon" onClick={toggleTheme} className="absolute top-6 right-6">
            {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
      </Button>
    </>
  )
}

export default ToggleTheme

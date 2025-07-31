/**
 * Theme Switcher Component
 * Provides a dropdown interface for switching between available themes
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/theme-context';
import { getAllThemes } from '@/lib/themes';
import { Palette } from 'lucide-react';

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const themes = getAllThemes();
  
  // Separate basic and brand themes
  const basicThemes = themes.filter(theme => theme.id === 'light' || theme.id === 'dark');
  const brandThemes = themes.filter(theme => !['light', 'dark'].includes(theme.id));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Switch theme"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 backdrop-blur-md bg-background/90 border border-border/20"
        sideOffset={8}
      >
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2">
          Appearance
        </DropdownMenuLabel>
        {basicThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`
              flex items-center space-x-2 cursor-pointer
              hover:bg-accent hover:text-accent-foreground
              focus:bg-accent focus:text-accent-foreground
              ${currentTheme === theme.id ? 'bg-accent/50 text-accent-foreground' : ''}
            `}
          >
            <span className="text-sm" role="img" aria-hidden="true">
              {theme.icon}
            </span>
            <span className="text-sm font-medium">{theme.name}</span>
            {currentTheme === theme.id && (
              <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2">
          Brand Themes
        </DropdownMenuLabel>
        {brandThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`
              flex items-center space-x-2 cursor-pointer
              hover:bg-accent hover:text-accent-foreground
              focus:bg-accent focus:text-accent-foreground
              ${currentTheme === theme.id ? 'bg-accent/50 text-accent-foreground' : ''}
            `}
          >
            <span className="text-sm" role="img" aria-hidden="true">
              {theme.icon}
            </span>
            <span className="text-sm font-medium">{theme.name}</span>
            {currentTheme === theme.id && (
              <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
import React from 'react';
import { Button } from './ui/button';
import { Minus, Plus, Play, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ControlBarProps {
  onFontDecrease: () => void;
  onFontIncrease: () => void;
  onTransposeDown: () => void;
  onTransposeUp: () => void;
  onAutoScroll: () => void;
  onSpeedDecrease: () => void;
  onSpeedIncrease: () => void;
  isScrolling?: boolean;
  scrollSpeed: number;
  transpose: number;
}

const ControlBar: React.FC<ControlBarProps> = ({
  onFontDecrease,
  onFontIncrease,
  onTransposeDown,
  onTransposeUp,
  onAutoScroll,
  onSpeedDecrease,
  onSpeedIncrease,
  isScrolling = false,
  scrollSpeed,
  transpose,
}) => {
  return (
    <div className="fixed bottom-4 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:w-[500px] sm:max-w-[95%]">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center justify-center p-3 gap-3">
          {/* Font & Key Controls - Visible only on Desktop */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Font Size Group */}
            <div className="flex items-center bg-gray-100/50 dark:bg-gray-800/50 rounded-xl px-2 py-1">
              <Button 
                variant="ghost"
                onClick={onFontDecrease}
                className="h-8 w-8 rounded-lg"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="w-6 text-center text-sm">Aa</span>
              <Button 
                variant="ghost"
                onClick={onFontIncrease}
                className="h-8 w-8 rounded-lg"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Transpose Group */}
            <div className="flex items-center bg-gray-100/50 dark:bg-gray-800/50 rounded-xl px-2 py-1">
              <Button 
                variant="ghost"
                onClick={onTransposeDown}
                className="h-8 w-8 rounded-lg"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="w-6 text-center text-sm">
                {transpose > 0 ? `+${transpose}` : 'Key'}
              </span>
              <Button 
                variant="ghost"
                onClick={onTransposeUp}
                className="h-8 w-8 rounded-lg"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Auto Scroll Controls - Always Visible */}
          <div className="flex items-center bg-gray-100/50 dark:bg-gray-800/50 rounded-xl px-2 py-1">
            <Button 
              variant={isScrolling ? "default" : "ghost"}
              onClick={onAutoScroll}
              className={`h-8 px-3 rounded-lg flex items-center gap-2 transition-colors
                ${isScrolling 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'hover:bg-gray-200/50 dark:hover:bg-gray-700/50'}`}
            >
              <Play className="h-3.5 w-3.5" />
              <span className="text-sm font-medium min-w-[24px]">
                {scrollSpeed.toFixed(1)}x
              </span>
            </Button>
            <div className="flex items-center ml-1">
              <Button 
                variant="ghost"
                onClick={onSpeedDecrease}
                className="h-8 w-8 rounded-lg"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant="ghost"
                onClick={onSpeedIncrease}
                className="h-8 w-8 rounded-lg"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* More Options Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button 
                variant="ghost"
                className="h-8 w-8 rounded-lg bg-gray-100/50 dark:bg-gray-800/50"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[200px] p-2">
              {/* Mobile Font Controls */}
              <div className="sm:hidden flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium">Font Size</span>
                <div className="flex items-center bg-gray-100/50 dark:bg-gray-800/50 rounded-lg">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={onFontDecrease}
                    className="h-7 w-7 rounded-lg"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="hidden sm:inline w-6 text-center text-sm">Aa</span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={onFontIncrease}
                    className="h-7 w-7 rounded-lg"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              {/* Mobile Key Controls */}
              <div className="sm:hidden flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium">Key</span>
                <div className="flex items-center bg-gray-100/50 dark:bg-gray-800/50 rounded-lg">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={onTransposeDown}
                    className="h-7 w-7 rounded-lg"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="w-6 text-center text-sm">
                    {transpose > 0 ? `+${transpose}` : 'Key'}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={onTransposeUp}
                    className="h-7 w-7 rounded-lg"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" /> */}

              <DropdownMenuItem>Print</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ControlBar;

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  initialQuery?: string;
  searchQuery?: string;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchBar({ 
  onSearch, 
  className = '', 
  initialQuery = '',
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery
}: SearchBarProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(initialQuery);
  
  const searchQuery = externalSearchQuery ?? internalSearchQuery;
  const setSearchQuery = externalSetSearchQuery ?? setInternalSearchQuery;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  useEffect(() => {
    if (!externalSetSearchQuery) {
      setInternalSearchQuery(initialQuery);
    }
  }, [initialQuery, externalSetSearchQuery]);

  return (
    <form onSubmit={handleSubmit} className={`${className}`}>
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            value={searchQuery}
            onChange={handleChange}
            placeholder="Search songs..."
            className="w-full pl-10"
          />
        </div>
        <Button type="submit">
          Search
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  );
}

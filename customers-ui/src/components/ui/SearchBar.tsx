import { useCallback } from "react";
import { Input } from "./Input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import debounce from "lodash/debounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Search...",
  className,
}: SearchBarProps) {
  // Debounce the search callback
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
      <Input
        className="pl-9"
        type="search"
        placeholder={placeholder}
        onChange={(e) => debouncedSearch(e.target.value)}
      />
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function Search() {
  return (
    <form action="/search" method="GET" className="w-full">
      <div className="relative w-full flex items-center">
        <Input
          name="q"
          type="text"
          placeholder="Search..."
          className="w-full pl-4 pr-12 py-2 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
          aria-label="Search"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function Search() {
  return (
    <form action="/search" method="GET" className="w-full">
      <div className="relative w-full ">
        <Input
          name="q"
          type="text"
          placeholder="Search..."
          className="w-full pl-4 pr-10" // Padding for the icon inside the input
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <SearchIcon className="text-blue-400 hover:text-blue-600 transition duration-200 ease-in-out cursor-pointer" />
        </button>
      </div>
    </form>
  );
}

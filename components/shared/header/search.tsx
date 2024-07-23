import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react';


export default async function Search() {
  return (
    <form action="/search" method="GET">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          name="q"
          type="text"
          placeholder="Search..."
          className="md:w-[100px] lg:w-[300px]"
        />

        <SearchIcon className="text-blue-400 hover:text-blue-600 transition duration-200 ease-in-out  cursor-pointer" />
      </div>
    </form>
  );
}

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react';


export default async function Search() {
  return (
    <form action="/search" method="GET">
      <div className="flex w-full max-w-md items-center space-x-15">
        <Input
          name="q"
          type="text"
          placeholder="Search..."
          className="md:w-[100px] lg:w-[300px]"
        />

        <div className="flex w-full max-w-md items-center space-x-20">
          <Button variant={"ghost"}>
            <SearchIcon className="text-blue-400 hover:text-blue-600 transition duration-200 ease-in-out  cursor-pointer  " />
          </Button>
        </div>
      </div>
    </form>
  );
}

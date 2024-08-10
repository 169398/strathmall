import Search from "./header/search";
import Header from "./header";
import Alert from "./NavbarAlert";

export default function MobileNav() {
  return (
    <div className="flex flex-col items-center lg:hidden w-full mt-4">
      <div className="flex items-center w-full space-x-4">
        <div className="h-8 w-full max-w-xs text-sm">
          <Search />
        </div>
        <Alert />
        <Header />
      </div>
    </div>
  );
}

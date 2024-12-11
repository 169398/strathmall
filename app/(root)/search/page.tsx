import { SearchSkeleton } from "@/components/shared/skeletons/SearchSkeleton";
import ViewMore from "@/components/shared/view-more-product";
import { Button } from "@/components/ui/button";
import {
  getAllCategories,
  getAllSearchProducts,
} from "@/lib/actions/sellerproduct.actions";
import { APP_NAME } from "@/lib/constants";
import Link from "next/link";
import FiltersDropdown from "@/components/shared/FiltersDropdown";

const sortOrders = ["newest", "lowest", "highest", "rating"];
const prices = [
  { name: "ksh1 to ksh100", value: "1-100" },
  { name: "ksh201 to ksh1000", value: "201-1000" },
  { name: "ksh1001 to ksh5000", value: "1001-5000" },
  { name: "ksh5001 to ksh10000", value: "5001-10000" },
];
const ratings = [4, 3, 2, 1];

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
  }>;
}) {
  const { q = "all", category = "all" } = await searchParams;
  return {
    title: `${q !== "all" ? q : "Search"} ${
      category !== "all" ? `in ${category}` : ""
    } - ${APP_NAME}`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "featured",
  } = await searchParams;

  const categories = await getAllCategories();
  const products = await getAllSearchProducts({
    category,
    query: q,
    price,
    rating,
    sort,
  });

  if (!categories || !products) {
    return <SearchSkeleton />;
  }

  return (
    <div className="flex flex-col md:grid md:grid-cols-5 gap-4 p-4 pt-10 relative">
      {/* Filters Dropdown */}
      <div className="md:col-span-1 top-12 sticky hidden md:block">
        {/* Filters always shown on medium and above */}
        <FiltersDropdown
          categories={categories}
          prices={prices}
          ratings={ratings}
        />
      </div>

      {/* For small screens: Floating Filters */}


      
      <div className="block md:hidden fixed left-0 top-40 z-50 w-[50%] max-w-[250px] p-4 mr-2 ">
        <FiltersDropdown
          categories={categories}
          prices={prices}
          ratings={ratings}
        />
</div>
      {/* Product Listing Section */}
      <div className="md:col-span-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 my-4">
          <div className="flex flex-wrap items-center space-y-2 md:space-x-2 md:space-y-0">
            {q !== "all" && q !== "" && (
              <span className="text-sm">Query: {q}</span>
            )}
            {category !== "all" && (
              <span className="text-sm">Category: {category}</span>
            )}
            {price !== "all" && <span className="text-sm">Price: {price}</span>}
            {rating !== "all" && (
              <span className="text-sm">Rating: {rating} & up</span>
            )}
            &nbsp;
            {(q !== "all" && q !== "") ||
            category !== "all" ||
            rating !== "all" ||
            price !== "all" ? (
              <Button variant={"link"} asChild aria-label="clear">
                <Link href="/search">Clear</Link>
              </Button>
            ) : null}
          </div>

          <div className="text-sm">
            Sort by{" "}
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={`mx-2 ${sort === s && "text-primary"}`}
                href={`/search?sort=${s}`}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        {products.data.length === 0 && <div>No products found</div>}
        <ViewMore data={products.data} />
      </div>
    </div>
  );
}

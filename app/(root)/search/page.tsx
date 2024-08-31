import { SearchSkeleton } from "@/components/shared/skeletons/SearchSkeleton";
import ViewMore from "@/components/shared/view-more-product";
import { Button } from "@/components/ui/button";
import {
  getAllCategories,
  getAllSearchProducts,
} from "@/lib/actions/sellerproduct.actions";
import { APP_NAME } from "@/lib/constants";
import Link from "next/link";

const sortOrders = ["newest", "lowest", "highest", "rating"];
const prices = [
  { name: "ksh1 to ksh100", value: "1-100" },
  { name: "ksh201 to ksh1000", value: "201-1000" },
  { name: "ksh1001 to ksh5000", value: "1001-5000" },
  { name: "ksh5001 to ksh10000", value: "5001-10000" },
];
const ratings = [4, 3, 2, 1];

export async function generateMetadata({
  searchParams: { q = "all", category = "all", price = "all", rating = "all" },
}: {
  searchParams: {
    q: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  };
}) {
  if (
    (q !== "all" && q !== "") ||
    category !== "all" ||
    rating !== "all" ||
    price !== "all"
  ) {
    return {
      title: `Search ${q !== "all" ? q : ""}${
        category !== "all" ? ` : Category ${category}` : ""
      }${price !== "all" ? ` : Price ${price}` : ""}${
        rating !== "all" ? ` : Rating ${rating}` : ""
      } - ${APP_NAME}`,
    };
  } else {
    return {
      title: `Search Products - ${APP_NAME}`,
    };
  }
}

export default async function SearchPage({
  searchParams: {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
  },
}: {
  searchParams: {
    q: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  };
}) {
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
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="md:col-span-1 space-y-6 px-4 md:px-0">
        <div className="text-xl pt-3">Categories</div>
        <div>
          <ul className="space-y-2">
            <li>
              <Link href={`/search?category=all`}>Any</Link>
            </li>
            {categories.map((c: { name: string }) => (
              <li key={c.name}>
                <Link href={`/search?category=${c.name}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xl pt-3">Price</div>
          <ul className="space-y-2">
            <li>
              <Link href={`/search?price=all`}>Any</Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link href={`/search?price=${p.value}`}>{p.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xl pt-3">Customer Review</div>
          <ul className="space-y-2">
            <li>
              <Link href={`/search?rating=all`}>Any</Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link href={`/search?rating=${r}`}>{`${r} stars & up`}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="md:col-span-4 space-y-4 px-4 md:px-0">
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
              <Button variant={"link"} asChild>
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

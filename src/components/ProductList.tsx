





















































































































































































import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import Image from "next/image";
import Link from "next/link"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { MapPin, Menu, Search, ShoppingCart, User } from 'lucide-react';
import Pagination from "./Pagination";

const PRODUCT_PER_PAGE = 8;

const ProductList = async ({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}) => {
  const wixClient = await wixClientServer();

  const productQuery = wixClient.products
    .queryProducts()
    .startsWith("name", searchParams?.name || "")
    .eq("collectionIds", categoryId)
    .hasSome(
      "productType",
      searchParams?.type ? [searchParams.type] : ["physical", "digital"]
    )
    .gt("priceData.price", searchParams?.min || 0)
    .lt("priceData.price", searchParams?.max || 999999)
    .limit(limit || PRODUCT_PER_PAGE)
    .skip(
      searchParams?.page
        ? parseInt(searchParams.page) * (limit || PRODUCT_PER_PAGE)
        : 0
    );

  if (searchParams?.sort) {
    const [sortType, sortBy] = searchParams.sort.split(" ");

    if (sortType === "asc") {
      productQuery.ascending(sortBy);
    }
    if (sortType === "desc") {
      productQuery.descending(sortBy);
    }
  }

  const res = await productQuery.find();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">

        </div>

        <div className="flex items-center justify-between mb-8">
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {res.items.map((product: products.Product) => (
            <Card key={product._id} className="overflow-hidden transition-all duration-300 hover:shadow-lg py-[-3rem] hover:-translate-y-1 flex flex-col">
              <Link href={"/" + product.slug} className="flex-grow">
                <div className="relative aspect-square px-6 bg-secondary/30">
                  <Image
                    src={product.media?.mainMedia?.image?.url || "/product.png"}
                    alt="meme"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-contain transition-opacity duration-300 ease-in-out group-hover:opacity-75"
                  />
                </div>
                <CardContent className="p-4 bg-primary/5">
                  <h3 className="text-lg font-semibold line-clamp-1 text-primary">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {product.additionalInfoSections?.find((section: any) => section.title === "shortDesc")?.description || ""}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-primary font-bold text-lg">R{product.price?.price}</span>
                    <Button variant="secondary" size="sm" className="bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {searchParams?.cat || searchParams?.name ? (
          <Pagination
            currentPage={res.currentPage || 0}
            hasPrev={res.hasPrev()}
            hasNext={res.hasNext()}
          />
        ) : null}
      </main>
    </div>
  );
};

export default ProductList;


import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    if (sortType === "asc") productQuery.ascending(sortBy);
    if (sortType === "desc") productQuery.descending(sortBy);
  }

  const res = await productQuery.find();

  // Function to calculate discount percentage
  const calculateDiscount = (product: products.Product) => {
    const price = product.price?.price || 0;
    const discount = product.discount?.value || 0;
    if (discount && price) {
      return Math.round((discount / price) * 100);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-black">
      <main className="container mx-auto px-2 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold flex justify-between items-center text-white">
            Top Deals
            <Link href="/deals" className="text-sm text-blue-600 font-normal">
              View more
            </Link>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {res.items.map((product: products.Product) => {
            const discountPercentage = calculateDiscount(product);
            const originalPrice = product.price?.price || 0;
            const discountedPrice = product.discount?.value 
              ? originalPrice - product.discount.value 
              : originalPrice;

            return (
              <Card key={product._id} className="border rounded-lg overflow-hidden">
                <Link href={"/" + product.slug}>
                  <div className="relative aspect-square p-4 bg-white">
                    {discountPercentage && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs rounded-full">
                        {discountPercentage}% Off
                      </div>
                    )}
                    <Image
                      src={product.media?.mainMedia?.image?.url || "/product.png"}
                      alt={product.name || "Product image"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-contain"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="text-sm font-medium line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold">
                          R{discountedPrice.toFixed(2)}
                        </span>
                        {discountPercentage && (
                          <span className="text-sm text-gray-400 line-through">
                            R{originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        Add to cart
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>

        {(searchParams?.cat || searchParams?.name) && (
          <Pagination
            currentPage={res.currentPage || 0}
            hasPrev={res.hasPrev()}
            hasNext={res.hasNext()}
          />
        )}
      </main>
    </div>
  );
};

export default ProductList;
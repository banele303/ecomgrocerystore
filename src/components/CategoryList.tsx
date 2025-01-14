import { wixClientServer } from "@/lib/wixClientServer";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from 'lucide-react';

const CategoryList = async () => {
  const wixClient = await wixClientServer();
  const cats = await wixClient.collections.queryCollections().find();

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Browse Categories</h2>
      <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide">
        {cats.items.map((item) => (
          <Link
            href={`/list?cat=${item.slug}`}
            key={item._id}
            className="group flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
          >
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
              <CardContent className="p-0">
                <div className="relative w-full h-[250px] bg-slate-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.media?.mainMedia?.image?.url || "/cat.png"}
                    alt={item.name || "Category image"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {item.name}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>Explore</span>
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;

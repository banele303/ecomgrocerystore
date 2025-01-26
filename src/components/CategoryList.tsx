import { wixClientServer } from "@/lib/wixClientServer";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ArrowRight } from 'lucide-react';

const CategoryList = async () => {
  const wixClient = await wixClientServer();
  const cats = await wixClient.collections.queryCollections().find();

  return (
    <div className="relative container mx-auto px-4 py-12 bg-black">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-300">
        Discover Our Collections
      </h2>
      
      {/* Scroll Indicator */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10 flex items-center animate-pulse">
        <ArrowRight className="w-8 h-8 text-white/70 mr-2" />
        <span className="text-white/70 text-sm font-medium">Scroll</span>
      </div>

      <div className="relative flex gap-6 overflow-x-auto py-4 scrollbar-hide scroll-smooth group">
        {cats.items.map((item) => (
          <Link
            href={`/list?cat=${item.slug}`}
            key={item._id}
            className="group flex-shrink-0 w-[280px] focus:outline-none"
          >
            <Card className="overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:ring-4 hover:ring-primary/30 rounded-2xl">
              <CardContent className="p-0">
                <div className="relative w-full h-[300px] bg-slate-100 rounded-t-2xl overflow-hidden">
                  <Image
                    src={item.media?.mainMedia?.image?.url || "/cat.png"}
                    alt={item.name || "Category image"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110 brightness-90 group-hover:brightness-100"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <div className="p-5 bg-white dark:bg-slate-800">
                  <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white transition-colors duration-300 group-hover:text-primary">
                    {item.name}
                  </h3>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <span className="mr-2">Explore Collection</span>
                    <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
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
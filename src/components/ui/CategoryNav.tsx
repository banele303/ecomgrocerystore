import { wixClientServer } from "@/lib/wixClientServer"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import PromotionalBanner from "../AdvertisingBunner"

const ShopCategories = async () => {
  const wixClient = await wixClientServer()
  const cats = await wixClient.collections.queryCollections().find()

  return (
    <div className="flex flex-col gap-8 p-4">
      {/* Banner */}
      <PromotionalBanner/>

      {/* Categories Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Shop by Aisle</h2>
        <div className="grid grid-cols-4 gap-4">
          {cats.items.map((item) => (
            <Link href={`/list?cat=${item.slug}`} key={item._id} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Image
                  src={item.media?.mainMedia?.image?.url || "/cat.png"}
                  alt={item.name || "Category image"}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-sm text-center">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Stores Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Shop by Store</h2>
          
        </div>
        <div className="grid grid-cols-2 gap-4">
          {cats.items.slice(0, 4).map((store) => (
            <Link key={store._id} href={`/list?cat=${store.slug}`}>
              <Card className="p-4 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={store.media?.mainMedia?.image?.url || "/cat.png"}
                    alt={store.name || "Store image"}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{store.name}</span>
                  <span className="text-sm text-gray-500">Store Name</span>
                </div>
                <ChevronRight className="ml-auto w-5 h-5 text-gray-400" />
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShopCategories


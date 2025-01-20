import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function PromotionalBanner() {
  return (
    <div className="space-y-6">
      <div className="relative w-full h-40 rounded-lg overflow-hidden">
        <Image
          src="/biscuits.jpeg"
          alt="Promotional Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h2 className="text-white text-2xl font-bold">CHATEAU GATEAUX:</h2>
            <p className="text-white text-lg">BIG CAKE ENERGY</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/90 px-3 py-1.5 rounded text-sm font-medium">Use code: FIFTY50</div>
            <Button size="sm" variant="secondary">
              Shop Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


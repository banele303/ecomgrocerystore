'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const slides = [
  {
    id: 1,
    title: "Summer Flavor Explosion",
    description: "Curated Refreshments That Redefine Cool",
    img: "/juice.jpeg",
    url: "/summer-collection",
    bg: "from-emerald-500 to-teal-400",
    accent: "bg-gradient-to-r from-emerald-400 to-teal-500",
    product: { name: "Artisan Fizzy Cola", price: "R12.99" }
  },
  {
    id: 2,
    title: "Crisp. Gourmet. Irresistible.",
    description: "Elevate Your Snack Experience",
    img: "/layers.jpeg", 
    url: "/premium-snacks",
    bg: "from-amber-500 to-orange-400",
    accent: "bg-gradient-to-r from-amber-400 to-orange-500",
    product: { name: "Truffle Potato Chips", price: "R19.99" }
  },
  {
    id: 3,
    title: "Pure Wellness in Every Sip",
    description: "Organic Juices, Crafted with Passion",
    img: "/juice.jpeg",
    url: "/wellness-juices",
    bg: "from-indigo-500 to-purple-400",
    accent: "bg-gradient-to-r from-indigo-400 to-purple-500",
    product: { name: "Cold-Pressed Fusion", price: "R14.99" }
  },
]

export default function USAGroceryHeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-black/90">
      <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>
      
      <div
        className="relative w-full h-[100vh] transition-transform duration-700 ease-in-out flex"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <Card
            key={slide.id}
            className={`w-full flex-shrink-0 border-none  shadow-none bg-gradient-to-br ${slide.bg}`}
          >
            <CardContent className="relative z-10 flex flex-col md:flex-row items-center justify-between h-[700px] p-8 overflow-hidden">
              <div className="w-full md:w-1/2 z-20 flex flex-col gap-6 text-center md:text-left">
                <Badge 
                  className={`w-fit mx-auto md:mx-0 text-sm text-white ${slide.accent}`}
                >
                  Exclusive Release
                </Badge>
                
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
                  {slide.title}
                </h2>
                
                <p className="text-lg md:text-xl text-white/90 max-w-md mx-auto md:mx-0 drop-shadow-md">
                  {slide.description}
                </p>
                
                <div className="mt-6 flex flex-col md:flex-row items-center gap-4">
                  <Link href={slide.url} className="w-full md:w-auto">
                    <Button 
                      size="lg" 
                      className={`w-full md:w-auto ${slide.accent} hover:brightness-110 transition-all`}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" /> Shop Now
                    </Button>
                  </Link>
                  
                  <div className="text-center md:text-left">
                    <p className="text-sm text-white/70">{slide.product.name}</p>
                    <p className="text-2xl font-bold text-white">{slide.product.price}</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 h-full relative flex items-center justify-center">
                <div className="absolute w-96 h-96 rounded-full bg-white/10 backdrop-blur-2xl animate-pulse"></div>
                
                <div className="relative z-30 w-72  h-72 rounded-full overflow-hidden shadow-2xl border-4 border-white/30">
                  <Image
                    src={slide.img}
                    alt={slide.title}
                    fill
                    className="object-cover p-8 bg-white transition-transform duration-500 hover:scale-110"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="absolute top-1/2 w-full flex justify-between px-4 z-50 transform -translate-y-1/2">
        <button
          onClick={prevSlide}
          className="bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <button
          onClick={nextSlide}
          className="bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>
      
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index
                ? "bg-white scale-150"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
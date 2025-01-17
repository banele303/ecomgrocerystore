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
    title: "Refreshing Summer Drinks",
    description: "Cool off with our selection of icy beverages!",
    img: "/juice.jpeg",
    url: "/summer-drinks",
    bg: "from-cyan-200 to-blue-200",
    product: { name: "Fizzy Cola", price: "R10.99" }
  },
  {
    id: 2,
    title: "Crispy Snack Attack",
    description: "Satisfy your cravings with our crunchy treats!",
    img: "/layers.jpeg",
    url: "/snacks",
    bg: "from-yellow-200 to-orange-200",
    product: { name: "Potato Chips", price: "R18.99" }
  },
  {
    id: 3,
    title: "Healthy Fruit Juices",
    description: "Natural goodness in every sip!",
    img: "/juice.jpeg",
    url: "/juices",
    bg: "from-green-200 to-lime-200",
    product: { name: "Mixed Fruit Juice", price: "R10.99" }
  },
]

export default function GroceryHeroSlider() {
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
    <div className="relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div
        className="relative w-full transition-transform duration-500 ease-out flex"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <Card
            key={slide.id}
            className={`w-full flex-shrink-0 border-none shadow-none bg-gradient-to-br ${slide.bg}`}
          >
            <CardContent className="flex flex-col md:flex-row items-center justify-between h-full p-6 md:p-8">
              <div className="w-full md:pl-[5rem] md:w-1/2 flex flex-col gap-4 text-center md:text-left mb-6 md:mb-0">
                <Badge variant="secondary" className="w-fit mx-auto md:mx-0 text-sm">
                  Featured Deal
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                  {slide.title}
                </h2>
                <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto md:mx-0">
                  {slide.description}
                </p>
                <div className="mt-4 flex flex-col md:flex-row items-center gap-4">
                  <Link href={slide.url}>
                    <Button size="lg" className="w-full md:w-auto">
                      <ShoppingCart className="mr-2 h-5 w-5" /> Shop Now
                    </Button>
                  </Link>
                  <div className="text-center md:text-right">
                    <p className="text-sm text-gray-600">{slide.product.name}</p>
                    <p className="text-xl font-bold text-gray-800">{slide.product.price}</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 h-64 md:h-80 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 md:w-64 md:h-64 rounded-full bg-white backdrop-blur-md shadow-lg flex items-center justify-center overflow-hidden">
                    <Image
                      src={slide.img}
                      alt={slide.title}
                      width={200}
                      height={200}
                      className="object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                    />
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-72 md:h-72 rounded-full border-4 border-dashed border-white/50 animate-spin-slow"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/50 hover:bg-white/75 text-gray-800 p-2 rounded-full transition-colors duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/50 hover:bg-white/75 text-gray-800 p-2 rounded-full transition-colors duration-200"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index
                ? "bg-gray-800 scale-125"
                : "bg-gray-400 hover:bg-gray-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}


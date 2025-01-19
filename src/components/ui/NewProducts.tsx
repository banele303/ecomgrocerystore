
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { products } from '@wix/stores'
import { wixClientServer } from '@/lib/wixClientServer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { MapPin, Menu, Search, ShoppingCart, User, Filter, ChevronDown } from 'lucide-react'
import Pagination from '../Pagination'

const PRODUCTS_PER_PAGE = 8
const FALLBACK_IMAGE = '/placeholder-product.jpg'

// Define valid sort fields for Wix Products API
type WixSortField = '_id' | 'name' | 'slug' | 'sku' | 'productType' | 'price' | 'priceData.price' | 'numericId' | 'lastUpdated'
type SortDirection = 'asc' | 'desc'

interface SortOption {
  label: string
  field: WixSortField
  direction: SortDirection
}

const SORT_OPTIONS: SortOption[] = [
  { label: 'Price: Low to High', field: 'priceData.price', direction: 'asc' },
  { label: 'Price: High to Low', field: 'priceData.price', direction: 'desc' },
  { label: 'Name A-Z', field: 'name', direction: 'asc' },
  { label: 'Name Z-A', field: 'name', direction: 'desc' },
  { label: 'Newest First', field: 'lastUpdated', direction: 'desc' },
]

interface SearchParams {
  name?: string
  type?: string
  min?: number
  max?: number
  page?: string
  sort?: string
  cat?: string
  category?: string
}

interface ProductsListProps {
  categoryId: string
  limit?: number
  searchParams?: SearchParams
}

export default function ProductsList({ categoryId, limit, searchParams }: ProductsListProps) {
  const [products, setProducts] = useState<products.Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSort, setCurrentSort] = useState<SortOption>(SORT_OPTIONS[0])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const wixClient = await wixClientServer()
        if (!wixClient) {
          throw new Error('Failed to initialize Wix client')
        }

        let query = wixClient.products.queryProducts()

        // Apply filters
        if (searchParams?.name) {
          query = query.startsWith('name', searchParams.name)
        }
        
        if (categoryId) {
          query = query.eq('collectionIds', categoryId)
        }

        if (searchParams?.type) {
          query = query.hasSome('productType', [searchParams.type])
        }

        // Price range filters
        const minPrice = searchParams?.min || 0
        const maxPrice = searchParams?.max || 999999
        query = query.gt('priceData.price', minPrice).lt('priceData.price', maxPrice)

        // Pagination
        const currentPage = searchParams?.page ? parseInt(searchParams.page) : 0
        const itemsLimit = limit || PRODUCTS_PER_PAGE
        query = query.limit(itemsLimit).skip(currentPage * itemsLimit)

        // Apply sorting
        if (searchParams?.sort) {
          const sortOption = SORT_OPTIONS.find(option => 
            `${option.direction} ${option.field}` === searchParams.sort
          ) || SORT_OPTIONS[0]
          
          if (sortOption.direction === 'asc') {
            query = query.ascending(sortOption.field)
          } else {
            query = query.descending(sortOption.field)
          }
        }

        const response = await query.find()
        setProducts(response.items)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [categoryId, limit, searchParams])

  const getProductImageAlt = (product: products.Product): string => {
    return product.name ? `${product.name} product image` : 'Product image'
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = FALLBACK_IMAGE
  }

  const shouldShowPagination = Boolean(
    searchParams?.cat || searchParams?.category || searchParams?.name
  )

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            ShopNow
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-secondary transition-colors">
              Home
            </Link>
            <Link href="/categories" className="hover:text-secondary transition-colors">
              Categories
            </Link>
            <Link href="/deals" className="hover:text-secondary transition-colors">
              Deals
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Discover Amazing Products
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative max-w-md w-full">
              <Input placeholder="Search products..." className="pl-10" />
              <Search className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Sort By
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {SORT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={`${option.direction}-${option.field}`}
                    onClick={() => setCurrentSort(option)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product._id} className="overflow-hidden h-full flex flex-col">
                <Link href={`/product/${product.slug}`} className="flex-grow">
                  <div className="relative aspect-square bg-secondary/30">
                    <Image
                      src={product.media?.mainMedia?.image?.url || FALLBACK_IMAGE}
                      alt={getProductImageAlt(product)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover"
                      onError={handleImageError}
                      priority={false}
                    />
                  </div>
                  <CardContent className="p-4 bg-primary/5 flex-grow">
                    <h3 className="text-lg font-semibold line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {product.description || 'No description available'}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold text-lg">
                        R{product.price?.price?.toFixed(2) || '0.00'}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-primary/10 hover:bg-primary hover:text-primary-foreground"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {shouldShowPagination && (
          <Pagination
            currentPage={searchParams?.page ? parseInt(searchParams.page) : 0}
            hasPrev={!!searchParams?.page && parseInt(searchParams.page) > 0}
            hasNext={products.length === PRODUCTS_PER_PAGE}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">About Us</h3>
              <p className="text-sm">
                We&apos;re passionate about bringing you the best products at great prices.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-sm hover:underline">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-sm hover:underline">
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-sm hover:underline">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <p className="text-sm">Email: support@shopnow.com</p>
              <p className="text-sm">Phone: (123) 456-7890</p>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            © {new Date().getFullYear()} ShopNow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
import ProductList from "@/components/ProductList";

import Skeleton from "@/components/Skeleton";
import Slider from "@/components/Slider";
import { Suspense } from "react";
import CategoryList from "@/components/CategoryList";
;
import ShopCategories from "@/components/ui/CategoryNav";

import ChocoList from "@/components/Chocolate";
import PromotionalBanner from "@/components/AdvertisingBunner";


const HomePage = async () => {


  return (
    <div className="">
      <Slider />
      <div className=" bg-black">
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 ">
       
      <div className="py-4">
        <Suspense fallback={<Skeleton />}>
        <h1 className="text-3xl font-bold text-center my-8 text-white">Our Categories</h1>
        <ShopCategories  />
        </Suspense>
      </div>




        <Suspense fallback={<Skeleton />}>
          <ProductList
            categoryId={process.env.FEATURED_PRODUCTS_FEATURED_CATEGORY_ID!}
            limit={8}
          />
        </Suspense>
      </div>





      <div className="py-4">
        <Suspense fallback={<Skeleton />}>
        <CategoryList  />
        </Suspense>
      </div>
      <div className="pt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">


     
<PromotionalBanner/>

      <Suspense fallback={<Skeleton />}>
          <ChocoList
           categoryId={process.env.NEXT_PUBLIC_WIX_LAYS_ID!}
           limit={8}
          />
        </Suspense>

        {/* <h1 className="text-2xl text-bold">New Products</h1>
        <Suspense fallback={<Skeleton />}>
          <NewProductsList
            categoryId={process.env.FEATURED_PRODUCTS_NEW_CATEGORY_ID!}
          
          />
        </Suspense> */}
      </div>
      </div>
    
    </div>
  );
};

export default HomePage;



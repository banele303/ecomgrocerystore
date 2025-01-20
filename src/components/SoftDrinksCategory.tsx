import { NewProductsData } from './NewProductsData';
import NewProductsClient from './NewProductsClient';
import { products } from "@wix/stores";

const SoftDrinks = async ({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}) => {
  const productsData: {
    products: products.Product[];
    currentPage: number;
    hasPrev: boolean;
    hasNext: boolean;
  } = await NewProductsData({ categoryId, limit, searchParams });

  return <NewProductsClient productsData={productsData} searchParams={searchParams} />;
};

export default SoftDrinks;











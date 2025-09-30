import { productService } from "@/services/product.service";
import ShopClientPage from "./page.client";
import { Product } from "@/types/product";

export const dynamic = "force-dynamic";

async function getShopProducts(): Promise<Product[]> {
  return await productService.getProducts({ count: 16, orderBy: "mostRecent" });
}

export default async function ShopPage() {
  const products = await getShopProducts();
  return <ShopClientPage products={products} />;
}

// next-frontend/src/app/(public)/page.tsx

import HeaderPublic from "@/components/public/HeaderPublic";
import FooterPublic from "@/components/shared/Footer";
import { productService } from "@/services/product.service";
import HomeClientPage from "./page.client";
import { Product } from "@/types/product";

export const dynamic = "force-dynamic";

async function getBestSellers(): Promise<Product[]> {
  return await productService.getProducts({ count: 5, orderBy: "bestSellers" });
}

export default async function HomePage() {
  const bestSellerProducts = await getBestSellers();

  return (
    <main className="min-h-screen flex flex-col">
      <HeaderPublic />
      <div className="flex-1">
        <HomeClientPage bestSellerProducts={bestSellerProducts} />
      </div>
      <FooterPublic />
    </main>
  );
}

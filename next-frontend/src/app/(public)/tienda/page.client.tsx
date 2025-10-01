"use client";

import Container from "@/components/shared/general/Container";
import ProductCard from "@/components/shared/woo/ProductCard";
import { Product } from "@/types/product";

interface ShopClientPageProps {
  products: Product[];
}

export default function ShopClientPage({ products }: ShopClientPageProps) {
  return (
    <>
      <div className="grid place-items-center my-6 lg:my-12">
        <h1 className="text-3xl font-semibold text-center font-montserrat mb-3">TIENDA</h1>
        <p>Esta es la descripcion de la tienda</p>
      </div>

      <Container className="my-6 lg:my-12 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <aside>
          <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        </aside>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showVariants={{ type: "color" }}
                size="sm"
              />
            ))}
          </div>
        ) : (
          <div className="grid place-items-center">
            <p>No se encontraron productos.</p>
          </div>
        )}
      </Container>
    </>
  );
}

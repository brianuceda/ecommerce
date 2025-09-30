"use client";

import { Product, ProductVariation } from "@/types/product";
import {
  parsePrice,
  calculateDiscount,
  formatPriceDisplay,
  parseColorFromDescription,
} from "@/utils/product.utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  showDiscountPercentage?: boolean;
  showVariants?: {
    type: "image" | "color";
  };
  size?: "sm" | "md";
  buttonStyle?: 1 | 2;
}

export default function ProductCard({
  product,
  showDiscountPercentage = true,
  showVariants = {
    type: "image",
  },
  buttonStyle = 1,
  size = "md",
}: ProductCardProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariation | null>(null);

  const firstVariant = product.variations?.nodes[0];
  const activeVariantData = selectedVariant || firstVariant;

  const primaryImage =
    activeVariantData?.image?.sourceUrl ||
    product.image?.sourceUrl ||
    "/images/product-image-fallback.webp";

  // Precio basado en la variante activa o el padre si no hay variante activa
  const priceStringToShow = activeVariantData
    ? activeVariantData.price
    : product.price;
  const regularPriceStringToShow = activeVariantData
    ? activeVariantData.regularPrice
    : product.regularPrice;

  const priceRange = parsePrice(priceStringToShow);
  const regularPriceRange = parsePrice(regularPriceStringToShow);

  // Descuento basado en el precio máximo del rango (si existe)
  const salePriceForCalc =
    priceRange.length > 0 ? Math.max(...priceRange) : null;
  const regularPriceForCalc =
    regularPriceRange.length > 0 ? Math.max(...regularPriceRange) : null;
  const discount =
    regularPriceForCalc !== null && salePriceForCalc !== null
      ? calculateDiscount(regularPriceForCalc, salePriceForCalc)
      : null;

  const productUrl = `/producto/${product.slug}${
    selectedVariant?.sku ? `?variant=${selectedVariant.sku}` : ""
  }`;

  return (
    <div className="flex flex-col border rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:translate-y-[-3px] transition-all duration-200 ease-in-out will-change-transform font-montserrat">
      <Link href={productUrl} className="block">
        <div className="relative w-full aspect-square bg-gray-100">
          <Image
            src={activeImage || primaryImage}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-300"
          />
        </div>
      </Link>

      <div className="p-3 text-center flex-1 flex flex-col justify-center">
        <div className="flex justify-center items-center">
          <Link
            href={productUrl}
            className={`${
                size === "sm" ? "text-[15px]" : size === "md" ? "text-base" : ""
              } font-semibold hover:text-secondary hover:scale-[1.025] transition-all duration-100`}
          >
            {product.name}
          </Link>
        </div>

        {/* Precios */}
        <div className="mt-2 flex items-center justify-center gap-4">
          <div className="flex flex-col">
            {discount && (
              <span className="text-sm text-gray-400 line-through truncate">
                {formatPriceDisplay(regularPriceRange)}
              </span>
            )}
            <span
              className={`${
                size === "sm" ? "text-base" : size === "md" ? "text-xl" : ""
              } font-bold text-secondary truncate`}
            >
              {formatPriceDisplay(priceRange) || (
                <span className="font-medium text-lg text-gray-400">
                  No disponible
                </span>
              )}
            </span>
          </div>

          {showDiscountPercentage && discount && (
            <div className="bg-secondary text-white text-xs font-bold px-2 py-1 rounded-md">
              ~{discount}%
            </div>
          )}
        </div>

        {/* <div className="flex-grow" /> */}

        {/* Variantes */}
        {showVariants &&
          product.variations &&
          product.variations.nodes.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-center space-x-2 h-8">
                {product.variations.nodes.map((variant) => {
                  const variantUrl = `/producto/${product.slug}${
                    variant.sku ? `?variant=${variant.sku}` : ""
                  }`;
                  return (
                    <Link href={variantUrl} key={variant.id}>
                      <VariantDisplay
                        variant={variant}
                        type={showVariants.type}
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                          e.preventDefault();
                          setSelectedVariant(variant);
                        }}
                        onMouseEnter={() =>
                          setActiveImage(variant.image?.sourceUrl || null)
                        }
                        onMouseLeave={() => setActiveImage(null)}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
      </div>

      <Link href={productUrl}>
        <button
          className={`w-sfull bg-secondary text-white font-medium ${
            buttonStyle == 1
              ? "py-3"
              : buttonStyle == 2
              ? "rounded-lg py-2 m-3 mt-0"
              : ""
          } hover:bg-secondary/80 transition-colors duration-300`}
        >
          Ver Producto
        </button>
      </Link>
    </div>
  );
}

interface VariantDisplayProps {
  variant: ProductVariation;
  type: "image" | "color";
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function VariantDisplay({ variant, type, onClick }: VariantDisplayProps) {
  const color =
    type === "color" ? parseColorFromDescription(variant.description) : null;
  const image =
    variant.image?.sourceUrl || "/images/product-image-fallback.webp";

  // Si el tipo es color y existe el atributo color, mostrar un círculo de ese color
  if (color) {
    return (
      <div
        title={variant.name}
        onClick={onClick}
        className="h-6 w-6 rounded-full border border-foreground/20 cursor-pointer transition-transform hover:scale-105"
        style={{ backgroundColor: color }}
      />
    );
  }

  // Si no, muestra la imagen de la variante (o el fallback)
  return (
    <div
      title={variant.name}
      onClick={onClick}
      className="relative h-6 w-6 rounded-full border border-foreground/20 overflow-hidden cursor-pointer transition-transform hover:scale-105"
    >
      <Image src={image} alt={variant.name} fill className="object-cover" />
    </div>
  );
}

export interface ProductImage {
  sourceUrl: string;
  altText: string | null;
}

export interface ProductVariationAttribute {
  name: string;
  value: string;
}

export interface ProductVariation {
  id: string;
  name: string;
  sku: string | null;
  price: string | null;
  regularPrice: string | null;
  image: ProductImage | null;
  description: string | null;
  attributes: {
    nodes: ProductVariationAttribute[];
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: string | null;
  regularPrice: string | null;
  image: ProductImage | null;
  attributes?: {
    nodes: {
      options: string[];
    }[];
  };
  variations?: {
    nodes: ProductVariation[];
  };
}
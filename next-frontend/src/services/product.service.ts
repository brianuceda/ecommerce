import { OrderByType } from "@/types/category";
import { Product, ProductVariation } from "@/types/product";

export const dynamic = "force-dynamic";

const ORDER_BY_MAP = {
  bestSellers: { field: "TOTAL_SALES", order: "DESC" },
  mostRecent: { field: "DATE", order: "DESC" },
  highestPrice: { field: "PRICE", order: "DESC" },
  lowestPrice: { field: "PRICE", order: "ASC" },
};

interface GraphQLResponse {
  data: {
    products: {
      nodes: Product[];
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

class ProductService {
  private apiUrl: string;
  private secretKey: string;

  constructor() {
    this.apiUrl = process.env.WC_GRAPHQL_API_URL || "";
    this.secretKey = process.env.WC_GRAPHQL_API_SECRET_KEY || "";

    if (!this.apiUrl || !this.secretKey) {
      console.warn(
        "API URL o Secret Key de WooCommerce no están configuradas."
      );
    }
  }

  // Lista de productos con variantes de WooCommerce con opciones de ordenamiento.
  async getProducts({
    count = 4,
    orderBy = "bestSellers",
    variants = { enabled: true },
  }: {
    count?: number;
    variants?: { enabled: boolean; count?: number };
    orderBy?: OrderByType;
  }): Promise<Product[]> {
    const orderbyObject = ORDER_BY_MAP[orderBy];
    const variantsCount = variants.count ?? 10;

    const variantsQuery = variants.enabled
      ? `
      attributes {
        nodes {
          options
        }
      }
      variations(first: ${variantsCount}, where: {orderby: {field: MENU_ORDER, order: ASC}}) {
        nodes {
          id
          name
          sku
          price(format: FORMATTED)
          regularPrice(format: FORMATTED)
          description
          image {
            sourceUrl
            altText
          }
          attributes {
            nodes {
              name
              value
            }
          }
        }
      }
    `
      : "";

    const query = `
      query GetProducts($count: Int!, $orderby: [ProductsOrderbyInput]!) {
        products(first: $count, where: {orderby: $orderby}) {
          nodes {
            id
            name
            slug
            image {
              sourceUrl
              altText
            }
            ... on SimpleProduct {
              price(format: FORMATTED)
              regularPrice(format: FORMATTED)
            }
            ... on VariableProduct {
              price(format: FORMATTED)
              regularPrice(format: FORMATTED)
              ${variantsQuery}
            }
          }
        }
      }
    `;

    try {
      const res = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": this.secretKey,
        },
        body: JSON.stringify({
          query,
          variables: {
            count,
            orderby: [orderbyObject],
          },
        }),
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Error en la respuesta de la API: ${res.statusText}`);
      }

      const jsonResponse: GraphQLResponse = await res.json();

      if (jsonResponse.errors) {
        console.error("Errores en GraphQL:", jsonResponse.errors);
        throw new Error("La API de GraphQL devolvió un error.");
      }

      const products = jsonResponse.data.products.nodes;

      if (variants.enabled) {
        // Ordenar las variantes según el orden de las opciones del atributo padre
        products.forEach((product: Product) => {
          if (
            product.variations?.nodes &&
            product.attributes?.nodes[0]?.options
          ) {
            const attributeOrder = product.attributes.nodes[0].options;
            product.variations.nodes.sort(
              (a: ProductVariation, b: ProductVariation) => {
                const valueA = a.attributes.nodes[0]?.value;
                const valueB = b.attributes.nodes[0]?.value;
                const indexA = attributeOrder.indexOf(valueA);
                const indexB = attributeOrder.indexOf(valueB);
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
              }
            );
          }
        });

        // Borrar variantes sin precio
        products.forEach((product: Product) => {
          if (product.variations?.nodes) {
            product.variations.nodes = product.variations.nodes.filter(
              (variant: ProductVariation) => variant.price !== null
            );
          }
        });
      }

      return products;
    } catch (error) {
      console.error("Falló el fetch a GraphQL:", error);
      return [];
    }
  }
}

export const productService = new ProductService();

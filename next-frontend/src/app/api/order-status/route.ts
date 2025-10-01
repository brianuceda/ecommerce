// src/app/api/order-status/route.ts

import { NextRequest, NextResponse } from "next/server";
import { isValidSignature } from "@/utils/server";
import { OrderStatus, VerifiedOrder } from "@/types/order";
import { parsePrice } from "@/utils/product";

// Tipo para la respuesta de GraphQL
interface GraphQLLineItem {
  quantity: number;
  total: string;
  product: {
    node: {
      name: string;
      price?: string;
      regularPrice?: string;
      image?: {
        sourceUrl: string;
        altText?: string;
      };
      weight?: string | null;
      width?: string | null;
      height?: string | null;
      length?: string | null;
    };
  };
  variation: {
    node: {
      name: string;
      price: string;
      regularPrice: string;
      image?: {
        sourceUrl: string;
        altText?: string;
      };
      weight?: string | null;
      width?: string | null;
      height?: string | null;
      length?: string | null;
    };
  } | null;
}

// Consulta GraphQL para obtener la orden verificada
const GET_VERIFIED_ORDER_QUERY = `
  query GetVerifiedOrder($orderId: ID!) {
    order(id: $orderId, idType: DATABASE_ID) {
      orderNumber
      status
      date
      shippingTotal
      subtotal
      total
      paymentMethodTitle
      billing {
        firstName
        lastName
        address1
        address2
        city
        state
        postcode
        country
        email
        phone
      }
      lineItems {
        nodes {
          quantity
          total
          product {
            node {
              ... on SimpleProduct {
                name
                price
                regularPrice
                image {
                  sourceUrl
                  altText
                }
              }
              ... on VariableProduct {
                name
                image {
                  sourceUrl
                  altText
                }
              }
            }
          }
          variation {
            node {
              name
              price
              regularPrice
              image {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const signature = searchParams.get("signature");

  if (!orderId || !signature) {
    return NextResponse.json(
      { error: "Parámetros faltantes." },
      { status: 400 }
    );
  }

  if (!isValidSignature(orderId, signature)) {
    return NextResponse.json(
      { error: "Firma inválida. Acceso no autorizado." },
      { status: 403 }
    );
  }

  const apiUrl = process.env.WC_GRAPHQL_API_URL;
  const appUsername = process.env.WC_GRAPHQL_API_APP_NAME;
  const appPassword = process.env.WC_GRAPHQL_API_APP_PASSWORD;

  if (!apiUrl || !appUsername || !appPassword) {
    return NextResponse.json(
      { error: "Error de configuración del servidor para GraphQL." },
      { status: 500 }
    );
  }

  const credentials = Buffer.from(`${appUsername}:${appPassword}`).toString(
    "base64"
  );

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        query: GET_VERIFIED_ORDER_QUERY,
        variables: { orderId },
      }),
      cache: "no-store",
    });

    const jsonResponse = await response.json();

    if (jsonResponse.errors) {
      return NextResponse.json(
        {
          error:
            jsonResponse.errors[0].message || "Error en la consulta GraphQL.",
        },
        { status: 400 }
      );
    }

    const data = jsonResponse.data.order;

    if (!data) {
      return NextResponse.json(
        { error: "La orden no fue encontrada." },
        { status: 404 }
      );
    }

    // Procesa los line items (productos simples y variantes)
    const lineItems = data.lineItems.nodes.map((item: GraphQLLineItem) => {
      // Si tiene variation, usa esos datos; si no, usa los del producto
      const productData = item.variation
        ? item.variation.node
        : item.product.node;
      const image = item.variation?.node.image || item.product.node.image;

      return {
        quantity: item.quantity,
        total: parsePrice(item.total)[0] || 0,
        name: productData.name,
        price: parsePrice(productData.price)[0] || 0,
        regular_price: parsePrice(productData.regularPrice)[0] || 0,
        image: image
          ? {
              source_url: image.sourceUrl,
              alt_text: image.altText || "",
            }
          : undefined,
      };
    });

    const order: VerifiedOrder = {
      order_number: data.orderNumber,
      status: data.status.toLowerCase() as OrderStatus,
      date: data.date,
      shipping_total: parsePrice(data.shippingTotal)[0] || 0,
      subtotal: parsePrice(data.subtotal)[0] || 0,
      total: parsePrice(data.total)[0] || 0,
      payment_method_title: data.paymentMethodTitle,
      billing: data.billing,
      line_items: lineItems,
    };

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error al contactar la API de GraphQL:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al verificar la orden." },
      { status: 500 }
    );
  }
}

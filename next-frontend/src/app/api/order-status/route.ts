import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID es requerido" },
      { status: 400 }
    );
  }
  
  const apiUrl = process.env.WC_REST_API_URL;
  const credentials = Buffer.from(
    `${process.env.WC_REST_API_CONSUMER_KEY}:${process.env.WC_REST_API_CONSUMER_SECRET}`
  ).toString("base64");

  try {
    const orderResponse = await fetch(`${apiUrl}/orders/${orderId}`, {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      cache: "no-store",
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.json();
      return NextResponse.json(
        { error: error.message || "Error al obtener la orden" },
        { status: orderResponse.status }
      );
    }

    const order = await orderResponse.json();

    return NextResponse.json({
      id: order.id,
      status: order.status,
      total: order.total,
    });
  } catch (error) {
    console.error("Error en API order-status:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

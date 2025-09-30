import { NextRequest, NextResponse } from "next/server";
import { OrderPayload } from "@/types/order";

export async function POST(req: NextRequest) {
  const apiUrl = process.env.WC_REST_API_URL;
  const customApiUrl = process.env.CUSTOM_REST_API_URL;
  const credentials = Buffer.from(
    `${process.env.WC_REST_API_CONSUMER_KEY}:${process.env.WC_REST_API_CONSUMER_SECRET}`
  ).toString("base64");

  try {
    const payload: OrderPayload = await req.json();

    // Validaciones
    if (!payload.payment_method || !payload.payment_method_title) {
      return NextResponse.json(
        { error: "Método de pago requerido" },
        { status: 400 }
      );
    }

    if (!payload.billing || !payload.billing.email) {
      return NextResponse.json(
        { error: "Información de facturación incompleta" },
        { status: 400 }
      );
    }

    if (!payload.line_items || payload.line_items.length === 0) {
      return NextResponse.json(
        { error: "Debe haber al menos un producto" },
        { status: 400 }
      );
    }

    // Crear orden en WooCommerce
    const orderResponse = await fetch(`${apiUrl}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.json();
      return NextResponse.json(
        { error: error.message || "Error al crear la orden" },
        { status: orderResponse.status }
      );
    }

    const order = await orderResponse.json();

    // Generar link de pago
    const paymentLinkResponse = await fetch(
      `${customApiUrl}/generate_payment_link`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order.id,
          payment_method: payload.payment_method,
        }),
      }
    );

    if (!paymentLinkResponse.ok) {
      console.error("Link de pago falló, pero orden fue creada:", order.id);
      return NextResponse.json({
        order,
        payment_url: null,
        warning: "Orden creada pero link de pago no disponible",
      });
    }

    const paymentLink = await paymentLinkResponse.json();

    return NextResponse.json({
      order,
      payment_url: paymentLink.payment_url,
    });
  } catch (error) {
    console.error("Error en checkout:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

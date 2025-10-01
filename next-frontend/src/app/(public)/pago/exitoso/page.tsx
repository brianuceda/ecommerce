"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader, Alert, Card } from "@mantine/core";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import Container from "@/components/shared/general/Container";
import Title from "@/components/shared/general/Title";
import Image from "next/image";
import { LineItemOrder } from "@/types/order";

async function fetchOrderStatus(orderId: string, signature: string) {
  const response = await fetch(
    `/api/order-status?orderId=${orderId}&signature=${signature}`
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || "No se pudo verificar el estado del pedido."
    );
  }
  const data = await response.json();
  console.log(data);
  return data;
}

function SuccessComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [params, setParams] = useState<{
    orderId: string;
    signature: string;
  } | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    const orderId = searchParams.get("orderId");
    const signature = searchParams.get("signature");

    if (!orderId || !signature) {
      router.replace("/");
      return;
    }

    hasRun.current = true;

    const cleanUrl = `${window.location.pathname}?orderId=${orderId}&signature=${signature}`;
    router.replace(cleanUrl, { scroll: false });

    setParams({ orderId, signature });
  }, [searchParams, router]);

  const {
    data: order,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["orderStatus", params?.orderId],
    queryFn: () => fetchOrderStatus(params!.orderId, params!.signature),
    enabled: !!params,
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading || !params) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <div className="grid place-items-center mb-2">
          <Loader size={48} />
        </div>
        <Title>Verificando la confirmación de tu pago...</Title>
        <p>Esto puede tardar unos segundos.</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert
        icon={<XCircle size={20} />}
        title="Error de Verificación"
        color="red"
        radius="md"
      >
        {error.message}
      </Alert>
    );
  }


  const isPaid =
    order?.status === "processing" || order?.status === "completed";

  return (
    <div className="space-y-6">
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      {isPaid ? (
        <>
          <div className="grid place-items-center mb-2">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
          <Title>¡Tu pago fue exitoso!</Title>
          <p>
            Hemos recibido tu pedido #{order?.id} y ya lo
            estamos preparando. Recibirás una confirmación por correo
            electrónico.
          </p>
        </>
      ) : (
        <Alert
          icon={<AlertCircle size={20} />}
          title="Pago Aprobado, Procesando Orden"
          color="yellow"
          radius="md"
        >
          Recibimos la aprobación de tu pago para la orden #{order?.id}. Estamos
          esperando la confirmación final en nuestro sistema.
        </Alert>
      )}
    </Card>

      {/* Detalles de la orden */}
      {order && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <h2 className="text-xl font-semibold mb-4">Detalles de tu pedido</h2>

          <div className="space-y-4">
            {/* Items de la orden */}
            <div>
              <h3 className="font-medium mb-2">Productos:</h3>
              {order.line_items.map((item: LineItemOrder, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 py-3 border-b last:border-b-0"
                >
                  {item.image && (
                    <Image
                      src={item.image.source_url}
                      alt={item.image.alt_text || item.name}
                      className="w-20 h-20 object-cover rounded"
                      width={120}
                      height={120}
                    />
                  )}
                  <div className="flex-1">
                    <span className="font-medium">{item.name}</span>
                    {item.regular_price > item.price && (
                      <p className="text-sm text-gray-500 line-through">
                        S/ {item.regular_price.toFixed(2)} c/u
                      </p>
                    )}
                    <p className="text-sm font-medium">
                      S/ {item.price.toFixed(2)} c/u
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      S/ {item.total.toFixed(2)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-600">
                        ({item.quantity} × {item.price.toFixed(2)})
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>S/ {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span>S/ {order.shipping_total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>S/ {order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Información de facturación */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Información de envío:</h3>
              <div className="text-sm text-gray-700">
                <p>
                  {order.billing.first_name} {order.billing.last_name}
                </p>
                <p>{order.billing.address1}</p>
                {order.billing.address2 && <p>{order.billing.address2}</p>}
                <p>
                  {order.billing.city}, {order.billing.state}{" "}
                  {order.billing.postcode}
                </p>
                <p className="mt-2">{order.billing.email}</p>
                <p>{order.billing.phone}</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function SuccessClientPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Container className="items-center text-center">
        <SuccessComponent />
      </Container>
    </Suspense>
  );
}

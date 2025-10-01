"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Text, Title, Loader, Alert, Center } from "@mantine/core";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function ExitosoPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("external_reference")?.replace("WC-", "");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<{ status: string; id: number } | null>(
    null
  );

  useEffect(() => {
    if (!orderId) {
      setError("No se encontró una referencia de pedido válida en la URL.");
      setIsLoading(false);
      return;
    }

    const verifyOrderStatus = async () => {
      try {
        const response = await fetch(`/api/order-status?orderId=${orderId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "No se pudo verificar el estado del pedido."
          );
        }
        const data = await response.json();
        setOrder({ status: data.status, id: data.id });
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Ocurrió un error inesperado al verificar tu orden."
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Le damos un pequeño tiempo al webhook para que llegue antes de consultar
    const timer = setTimeout(() => {
      verifyOrderStatus();
    }, 2000); // 2 segundos de espera

    return () => clearTimeout(timer);
  }, [orderId]);

  if (isLoading) {
    return (
      <Center style={{ flexDirection: "column" }}>
        <Loader />
        <Text mt="md">Verificando la confirmación de tu pago...</Text>
        <Text size="sm" c="dimmed">
          Esto puede tardar unos segundos.
        </Text>
      </Center>
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
        {error}
      </Alert>
    );
  }

  // El pago se aprobó, pero el webhook quizás no ha llegado. 'processing' o 'completed' son estados válidos.
  const isPaid =
    order?.status === "processing" || order?.status === "completed";

  return (
    <Center style={{ flexDirection: "column", textAlign: "center" }}>
      {isPaid ? (
        <>
          <CheckCircle2 size={48} className="text-green-500" />
          <Title order={2} mt="md">
            ¡Tu pago fue exitoso!
          </Title>
          <Text>
            Gracias por tu compra. Hemos recibido tu pedido #{order?.id} y ya lo
            estamos preparando. Recibirás una confirmación por correo
            electrónico.
          </Text>
        </>
      ) : (
        <Alert
          icon={<AlertCircle size={20} />}
          title="Pago Aprobado, Procesando Orden"
          color="yellow"
          radius="md"
        >
          Recibimos la aprobación de tu pago para la orden #{order?.id}. Estamos
          esperando la confirmación final en nuestro sistema para comenzar a
          procesarla. No necesitas hacer nada más.
        </Alert>
      )}
    </Center>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { Text, Title, Center, Button } from "@mantine/core";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function FallidoPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("external_reference")?.replace("WC-", "");

  return (
    <Center style={{ flexDirection: "column", textAlign: "center" }}>
      <XCircle size={48} className="text-red-500" />
      <Title order={2} mt="md">
        El pago fue rechazado
      </Title>
      <Text c="dimmed" mt="xs">
        {orderId
          ? `Hubo un problema al procesar el pago para tu pedido #${orderId}.`
          : "Hubo un problema al procesar tu pago."}
      </Text>
      <Text mt="lg">
        No se ha realizado ningún cargo a tu cuenta. Por favor, intenta
        nuevamente o utiliza otro método de pago.
      </Text>
      <Button component={Link} href="/pagar" mt="xl" variant="outline">
        Volver a intentar el pago
      </Button>
    </Center>
  );
}

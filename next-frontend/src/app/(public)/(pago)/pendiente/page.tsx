"use client";

import { useSearchParams } from "next/navigation";
import { Text, Title, Center } from "@mantine/core";
import { Hourglass } from "lucide-react";
import Link from "next/link";

export default function PendientePage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("external_reference")?.replace("WC-", "");

  return (
    <Center style={{ flexDirection: "column", textAlign: "center" }}>
      <Hourglass size={48} className="text-yellow-500" />
      <Title order={2} mt="md">
        Tu pago está pendiente de aprobación
      </Title>
      <Text c="dimmed" mt="xs">
        {orderId
          ? `Recibimos tu pedido #${orderId} y estamos esperando la confirmación del pago.`
          : "Estamos esperando la confirmación del pago."}
      </Text>
      <Text mt="lg">
        En cuanto el pago se acredite, procesaremos tu pedido y te enviaremos
        una notificación por correo electrónico. No necesitas hacer nada más.
      </Text>
      <Text mt="xl" size="sm">
        Puedes ver el estado de tus pedidos en{" "}
        <Link href="/mi-cuenta/pedidos">tu cuenta</Link>.
      </Text>
    </Center>
  );
}

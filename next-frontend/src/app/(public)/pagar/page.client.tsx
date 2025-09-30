"use client";

import { useState } from "react";
import { PaymentGateway } from "@/types/payment";
import { orderService } from "@/services/order.service";
import { Button, Paper, Text, Group, Alert } from "@mantine/core";
import { OrderPayload } from "@/types/order";

export default function CheckoutClientPage({
  gateways,
}: {
  gateways: PaymentGateway[];
}) {
  const [loadingGatewayId, setLoadingGatewayId] = useState<string | null>(null);

  const handlePlaceOrder = async (
    paymentMethodId: string,
    paymentMethodTitle: string
  ) => {
    setLoadingGatewayId(paymentMethodId);

    try {
      const orderData: OrderPayload = {
        payment_method: paymentMethodId,
        payment_method_title: paymentMethodTitle,
        set_paid: false,
        billing: {
          first_name: "Juan",
          last_name: "Perez",
          address_1: "Av. Falsa 123",
          city: "Lima",
          state: "LIMA",
          postcode: "15001",
          country: "PE",
          email: "juan.perez@example.com",
          phone: "987654321",
        },
        shipping: {
          first_name: "Juan",
          last_name: "Perez",
          address_1: "Av. Falsa 123",
          city: "Lima",
          state: "LIMA",
          postcode: "15001",
          country: "PE",
        },
        line_items: [{ product_id: 38, quantity: 1 }],
      };

      const result = await orderService.createOrderAndGetPaymentLink(orderData);

      if (!result) {
        alert("Error: No se pudo procesar el checkout");
        return;
      }

      console.log("Orden creada:", result.order.id);

      if (result.payment_url) {
        window.location.href = result.payment_url;
      } else {
        alert(result.warning || "Orden creada sin link de pago");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error en el checkout");
    } finally {
      setLoadingGatewayId(null);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "2rem" }}>
      <Text size="xl" mb="lg">
        Métodos de Pago Disponibles
      </Text>

      {gateways.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {gateways.map((gateway) => (
            <Paper withBorder shadow="sm" p="md" key={gateway.id}>
              <Group justify="space-between">
                <div>
                  <Text>{gateway.title}</Text>
                  <Text size="sm" c="dimmed">
                    {gateway.description}
                  </Text>
                </div>
                <Button
                  onClick={() => handlePlaceOrder(gateway.id, gateway.title)}
                  loading={loadingGatewayId === gateway.id}
                  disabled={loadingGatewayId !== null}
                >
                  Pagar con este método
                </Button>
              </Group>
            </Paper>
          ))}
        </div>
      ) : (
        <Alert color="blue" title="Información">
          No hay métodos de pago disponibles
        </Alert>
      )}
    </div>
  );
}

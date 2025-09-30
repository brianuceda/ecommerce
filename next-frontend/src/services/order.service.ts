import { OrderPayload } from "@/types/order";

interface CheckoutResponse {
  order: { id: number };
  payment_url: string | null;
  warning?: string;
}

class OrderService {
  async createOrderAndGetPaymentLink(
    payload: OrderPayload
  ): Promise<CheckoutResponse | null> {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error en el checkout");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en checkout:", error);
      return null;
    }
  }
}

export const orderService = new OrderService();

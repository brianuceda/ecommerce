import { PaymentGateway } from "@/types/payment";

class PaymentService {
  private apiUrl: string;
  private apiConsumerKey: string;
  private apiConsumerSecret: string;

  constructor() {
    this.apiUrl = process.env.WC_REST_API_URL || "";
    this.apiConsumerKey = process.env.WC_REST_API_CONSUMER_KEY || "";
    this.apiConsumerSecret = process.env.WC_REST_API_CONSUMER_SECRET || "";

    if (!this.apiUrl || !this.apiConsumerKey || !this.apiConsumerSecret) {
      console.warn(
        "API URL, Consumer Key o Consumer Secret de WooCommerce no están configuradas."
      );
    }
  }

  /**
   * Obtiene los métodos de pago que están Activos en WooCommerce.
   * @returns Una promesa que resuelve a un array solo con los métodos de pago habilitados.
   */
  async getAvailableGateways(): Promise<PaymentGateway[]> {
    const url = `${this.apiUrl}/payment_gateways`;

    const encodedCredentials = Buffer.from(
      `${this.apiConsumerKey}:${this.apiConsumerSecret}`
    ).toString("base64");

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Error en la API REST: ${response.statusText}`);
      }

      const allGateways: PaymentGateway[] = await response.json();
      const enabledGateways = allGateways.filter((gateway) => gateway.enabled);

      const cleanGateways: PaymentGateway[] = enabledGateways.map(
        (gateway) => ({
          id: gateway.id,
          title: gateway.title,
          description: gateway.description,
          method_title: gateway.method_title,
          enabled: gateway.enabled,
        })
      );

      return cleanGateways;
    } catch (error) {
      console.error("Falló al obtener los métodos de pago:", error);
      return [];
    }
  }
}

export const paymentService = new PaymentService();

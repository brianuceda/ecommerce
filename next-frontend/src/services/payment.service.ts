import { PaymentGateway } from "@/types/payment";

class PaymentService {
  private apiUrl: string;
  private authHeader: string;

  constructor() {
    this.apiUrl = process.env.WC_REST_API_URL || "";
    this.authHeader = "";

    const username = process.env.WC_GRAPHQL_API_APP_NAME || "";
    const password = process.env.WC_GRAPHQL_API_APP_PASSWORD || "";

    if (!this.apiUrl || !username || !password) {
      console.warn(
        "Credenciales REST inválidas."
      );
    } else {
      const encodedCredentials = Buffer.from(
        `${username}:${password}`
      ).toString("base64");
      this.authHeader = `Basic ${encodedCredentials}`;
    }
  }

  /**
   * Obtiene los métodos de pago que están Activos en WooCommerce.
   * @returns Una promesa que resuelve a un array solo con los métodos de pago habilitados.
   */
  async getAvailableGateways(): Promise<PaymentGateway[]> {
    const url = `${this.apiUrl}/payment_gateways`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: this.authHeader,
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

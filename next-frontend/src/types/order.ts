export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  ON_HOLD = "ON_HOLD",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
  FAILED = "FAILED",
  UNKNOWN = "UNKNOWN",
}

// Representa la estructura del payload para crear una Orden de Venta
export interface OrderPayload {
  payment_method: string;
  payment_method_title: string;
  set_paid: false;
  billing: OrderBillingInfo;
  shipping: OrderShippingInfo;
  line_items: {
    product_id: number;
    variation_id?: number;
    quantity: number;
  }[];
  customer_id?: number; // autenticación
}

// Representa la Información de facturación
export interface OrderBillingInfo {
  first_name: string;
  last_name: string;
  address_1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

// Representa la Información de envío
export type OrderShippingInfo = Omit<OrderBillingInfo, "email" | "phone">;

// Representa un ítem dentro de una Orden de Venta
export interface LineItemOrder {
  quantity: number;
  total: number;
  name: string;
  price: number;
  regular_price: number;
  image?: {
    source_url: string;
    alt_text?: string;
  };
}

// Representa una Orden de Venta ya pagada
export interface VerifiedOrder {
  order_number: string;
  status: OrderStatus;
  date: string;
  shipping_total: number;
  subtotal: number;
  total: number;
  payment_method_title: string;
  billing: OrderBillingInfo;
  line_items: LineItemOrder[];
}

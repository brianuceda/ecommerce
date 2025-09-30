export interface OrderPayload {
  payment_method: string;
  payment_method_title: string;
  set_paid: false;
  billing: BillingInfo;
  shipping: ShippingInfo;
  line_items: LineItem[];
  // Opcional: Si el cliente está logueado
  customer_id?: number;
}

export interface CreatedOrder {
  id: number;
  status: string;
  order_key: string;
  total: string;
}

export interface BillingInfo {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export type ShippingInfo = Omit<BillingInfo, "email" | "phone">;

export interface LineItem {
  product_id: number;
  quantity: number;
  variation_id?: number; // Si es un producto variable
}

export interface PaymentGateway {
  id: string;
  title: string;
  description: string;
  method_title: string;
  enabled: boolean;
}

export interface PaymentLinkResponse {
  payment_url: string;
}

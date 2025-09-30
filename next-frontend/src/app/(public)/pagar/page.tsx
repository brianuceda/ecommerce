import { paymentService } from "@/services/payment.service";
import CheckoutClientPage from "./page.client";

export default async function CheckoutPage() {
  const availableGateways = await paymentService.getAvailableGateways();
  return <CheckoutClientPage gateways={availableGateways} />;
}

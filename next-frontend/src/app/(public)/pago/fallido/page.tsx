"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader } from "@mantine/core";
import { XCircle } from "lucide-react";
import Link from "next/link";

function FailureComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [displayOrderId, setDisplayOrderId] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    const orderId = searchParams.get("orderId");
    const signature = searchParams.get("signature");

    if (!orderId || !signature) {
      router.replace("/");
      return;
    }

    hasRun.current = true;

    const cleanUrl = `${window.location.pathname}?orderId=${orderId}&signature=${signature}`;
    router.replace(cleanUrl, { scroll: false });
    setDisplayOrderId(orderId);
  }, [searchParams, router]);

  if (!displayOrderId) {
    return <Loader />;
  }

  return (
    <div>
      <XCircle size={48} className="text-red-500" />
      <h1>El pago fue rechazado</h1>
      <p>
        {`Hubo un problema al procesar el pago para tu pedido #${displayOrderId}.`}
      </p>
      <p>
        No se ha realizado ningún cargo a tu cuenta. Por favor, intenta
        nuevamente o utiliza otro método de pago.
      </p>
      <Link href="/pagar">
        <a>Volver a intentar el pago</a>
      </Link>
    </div>
  );
}

export default function FailureClientPage() {
  return (
    <Suspense fallback={<Loader />}>
      <div>
        <FailureComponent />
      </div>
    </Suspense>
  );
}

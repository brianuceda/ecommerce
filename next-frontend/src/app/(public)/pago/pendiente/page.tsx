"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader } from "@mantine/core";
import { Hourglass } from "lucide-react";
import Link from "next/link";

function PendingComponent() {
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
      <Hourglass size={48} className="text-yellow-500" />
      <h1>Tu pago está pendiente de aprobación</h1>
      <p>
        {`Recibimos tu pedido #${displayOrderId} y estamos esperando la confirmación del pago.`}
      </p>
      <p>
        En cuanto el pago se acredite, procesaremos tu pedido y te enviaremos
        una notificación por correo electrónico. No necesitas hacer nada más.
      </p>
      <p>
        Puedes ver el estado de tus pedidos en{" "}
        <Link href="/mi-cuenta/pedidos">
          <a>tu cuenta</a>
        </Link>
        .
      </p>
    </div>
  );
}

export default function PendingClientPage() {
  return (
    <Suspense fallback={<Loader />}>
      <div>
        <PendingComponent />
      </div>
    </Suspense>
  );
}

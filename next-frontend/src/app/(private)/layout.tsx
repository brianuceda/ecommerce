import HeaderPrivate from "@/components/private/HeaderPrivate";
import Footer from "@/components/shared/general/Footer";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col">
      <HeaderPrivate />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
    </main>
  );
}

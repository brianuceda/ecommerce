import HeaderPublic from "@/components/public/HeaderPublic";
import Footer from "@/components/shared/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col">
      <HeaderPublic />
      <div className="flex-1">{children}</div>
      <Footer />
    </main>
  );
}

import HeaderPublic from "@/components/public/HeaderPublic";
import Footer from "@/components/shared/general/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col">
      <HeaderPublic />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
    </main>
  );
}

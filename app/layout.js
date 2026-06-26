import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Panti Asuhan Kasih Sayang - Sistem Donasi Online",
  description:
    "Platform donasi online untuk Panti Asuhan Kasih Sayang. Donasi uang atau barang dengan mudah, aman, dan transparan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

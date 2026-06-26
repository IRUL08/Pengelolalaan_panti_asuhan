import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedGallery() {
  const data = [
    {
      title: "Penyaluran Bantuan Sembako",
      description: "Terima kasih kepada donatur yang telah menyisihkan rezekinya. Sembako telah disalurkan kepada anak-anak panti.",
      imageUrl: "https://forhumanity.id/wp-content/uploads/2026/01/WhatsApp-Image-2026-01-09-at-08.52.31-2-768x1024.jpeg",
      date: new Date("2026-01-09")
    },
    {
      title: "Bakti Sosial Bersama HR Club",
      description: "Kegiatan bakti sosial dan pemberian santunan kepada puluhan anak yatim di Panti Asuhan.",
      imageUrl: "https://harianbhirawa.co.id/wp-content/uploads/2025/03/8-hil-HR-Club-Pasuruan-Gelar-Baksos-ke-Puluhan-Anak-Yatim-di-Panti-Asuhan-Al-Ikhlas-3.jpg",
      date: new Date("2025-03-08")
    },
    {
      title: "Bantuan Pendidikan untuk Anak Yatim",
      description: "Penyaluran dana pendidikan agar anak-anak panti bisa terus bersekolah menggapai cita-cita mereka.",
      imageUrl: "https://atapkita.com/_next/image?url=https://api.atapkita.com/assets/images/campaign/campaign-resume/68be4fdb19067_fromweb.png&w=640&q=75",
      date: new Date()
    }
  ];

  for (const item of data) {
    await prisma.gallery.create({ data: item });
  }

  console.log("Gallery seeded successfully!");
}

seedGallery()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

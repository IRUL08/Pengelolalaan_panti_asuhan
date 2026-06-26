import "./page.css";
import Image from "next/image";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getGallery() {
  try {
    const gallery = await prisma.gallery.findMany({
      orderBy: { date: "desc" },
    });
    return gallery;
  } catch (error) {
    console.error("Failed to fetch gallery:", error);
    return [];
  }
}

export default async function GaleriPage() {
  const gallery = await getGallery();

  return (
    <div className="gallery-page">
      <div className="container">
        <div className="gallery-header animate-fade-in-up">
          <h1>Galeri Kegiatan</h1>
          <p>Potret momen kebersamaan dan senyum bahagia anak-anak panti asuhan berkat dukungan dari para donatur yang dermawan.</p>
        </div>

        {gallery.length === 0 ? (
          <div className="empty-state animate-fade-in">
            <span className="empty-icon">📷</span>
            <h3>Belum Ada Dokumentasi</h3>
            <p>Admin akan segera mengunggah foto-foto kegiatan panti asuhan di sini.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {gallery.map((item, index) => (
              <div 
                key={item.id} 
                className="gallery-card animate-fade-in-up" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="gallery-img-wrapper">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.title} 
                    fill
                    className="gallery-img"
                    unoptimized={true} // Karena menggunakan URL eksternal bebas
                  />
                </div>
                <div className="gallery-content">
                  <div className="gallery-date">
                    {new Date(item.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </div>
                  <h3 className="gallery-title">{item.title}</h3>
                  <p className="gallery-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { title, description, imageUrl, date } = await request.json();

    if (!title || !imageUrl) {
      return NextResponse.json({ error: "Judul dan Gambar wajib diisi" }, { status: 400 });
    }

    const gallery = await prisma.gallery.create({
      data: {
        title,
        description: description || "",
        imageUrl,
        date: date ? new Date(date) : new Date(),
      },
    });

    return NextResponse.json(gallery, { status: 201 });
  } catch (error) {
    console.error("Gallery create error:", error);
    return NextResponse.json({ error: "Gagal menyimpan kegiatan" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    await prisma.gallery.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery delete error:", error);
    return NextResponse.json({ error: "Gagal menghapus kegiatan" }, { status: 500 });
  }
}

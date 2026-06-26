import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const gallery = await prisma.gallery.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json({ error: "Gagal mengambil data galeri" }, { status: 500 });
  }
}

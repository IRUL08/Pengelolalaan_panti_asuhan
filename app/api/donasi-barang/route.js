import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { donorName, donorPhone, itemName, quantity, description, deliveryMethod, imageUrl } = body;

    if (!donorName || !itemName || !deliveryMethod) {
      return NextResponse.json(
        { error: "Nama, nama barang, dan metode pengiriman wajib diisi" },
        { status: 400 }
      );
    }

    const donation = await prisma.itemDonation.create({
      data: {
        donorName,
        donorPhone: donorPhone || "",
        itemName,
        quantity: quantity || "1",
        description: description || "",
        deliveryMethod,
        imageUrl: imageUrl || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    console.error("Error creating item donation:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan donasi barang" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const donations = await prisma.itemDonation.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(donations);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memuat donasi barang" },
      { status: 500 }
    );
  }
}

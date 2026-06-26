import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    const { id, type } = await request.json();

    if (!id || !type) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    if (type === "money") {
      const donation = await prisma.moneyDonation.findUnique({ where: { id } });
      if (!donation) {
        return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
      }

      await prisma.moneyDonation.delete({
        where: { id },
      });

      // Jika donasi yang dihapus statusnya SUCCESS, kita perlu mengurangi total di campaign (jika ada)
      if (donation.status === "SUCCESS" && donation.campaignId) {
        await prisma.campaign.update({
          where: { id: donation.campaignId },
          data: {
            currentAmount: { decrement: donation.amount },
          },
        });
      }

      return NextResponse.json({ success: true });
    } else if (type === "item") {
      await prisma.itemDonation.delete({
        where: { id },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Tipe tidak valid" }, { status: 400 });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}

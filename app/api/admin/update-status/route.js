import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, status, type } = body;

    if (!id || !status || !type) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    if (type === "money") {
      const donation = await prisma.moneyDonation.update({
        where: { id },
        data: { status },
      });

      // If marking as SUCCESS and linked to campaign, update campaign amount
      if (status === "SUCCESS" && donation.campaignId) {
        await prisma.campaign.update({
          where: { id: donation.campaignId },
          data: {
            currentAmount: { increment: donation.amount },
          },
        });
      }

      return NextResponse.json(donation);
    } else if (type === "item") {
      const donation = await prisma.itemDonation.update({
        where: { id },
        data: {
          status,
          receivedAt: status === "RECEIVED" ? new Date() : null,
        },
      });
      return NextResponse.json(donation);
    }

    return NextResponse.json({ error: "Tipe tidak valid" }, { status: 400 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Gagal update status" }, { status: 500 });
  }
}

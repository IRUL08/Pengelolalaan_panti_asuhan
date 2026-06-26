import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { donorName, amount, paymentMethod, campaignId, message } = body;

    if (!donorName || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Data donatur, jumlah, dan metode pembayaran wajib diisi" },
        { status: 400 }
      );
    }

    // Create the donation with status SUCCESS (simulated payment)
    const donation = await prisma.moneyDonation.create({
      data: {
        donorName,
        amount: parseInt(amount),
        paymentMethod,
        campaignId: campaignId || null,
        message: message || "",
        status: "SUCCESS",
      },
    });

    // Update campaign currentAmount if linked to a campaign
    if (campaignId) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          currentAmount: {
            increment: parseInt(amount),
          },
        },
      });
    }

    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    console.error("Error creating donation:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan donasi" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const donations = await prisma.moneyDonation.findMany({
      orderBy: { createdAt: "desc" },
      include: { campaign: true },
    });
    return NextResponse.json(donations);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memuat donasi" },
      { status: 500 }
    );
  }
}

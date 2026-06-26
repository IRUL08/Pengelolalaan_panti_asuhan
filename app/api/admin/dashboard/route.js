import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [
      totalMoneyDonations,
      totalItemDonations,
      totalExpenses,
      activeCampaigns,
      moneyDonationSum,
      expenseSum,
      recentMoneyDonations,
      recentItemDonations,
      pendingMoneyDonations,
      pendingItemDonations,
      campaigns,
      galleryData,
    ] = await Promise.all([
      prisma.moneyDonation.count(),
      prisma.itemDonation.count(),
      prisma.expense.count(),
      prisma.campaign.count({ where: { status: "ACTIVE" } }),
      prisma.moneyDonation.aggregate({
        where: { status: "SUCCESS" },
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({ _sum: { amount: true } }),
      prisma.moneyDonation.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { campaign: true },
      }),
      prisma.itemDonation.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.moneyDonation.count({ where: { status: "PENDING" } }),
      prisma.itemDonation.count({ where: { status: "PENDING" } }),
      prisma.campaign.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.gallery.findMany({ orderBy: { date: "desc" } }),
    ]);

    return NextResponse.json({
      stats: {
        totalMoneyDonations,
        totalItemDonations,
        totalExpenses,
        activeCampaigns,
        totalIncome: moneyDonationSum._sum.amount || 0,
        totalExpenseAmount: expenseSum._sum.amount || 0,
        pendingMoneyDonations,
        pendingItemDonations,
      },
      recentMoneyDonations,
      recentItemDonations,
      campaigns,
      gallery: galleryData,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data dashboard" },
      { status: 500 }
    );
  }
}

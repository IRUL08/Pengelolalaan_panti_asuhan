import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, amount, date, description } = body;

    if (!title || !amount || !date) {
      return NextResponse.json(
        { error: "Judul, jumlah, dan tanggal wajib diisi" },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: parseInt(amount),
        date: new Date(date),
        description: description || "",
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Expense error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan pengeluaran" },
      { status: 500 }
    );
  }
}

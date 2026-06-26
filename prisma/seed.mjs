import { PrismaClient } from "../app/generated/prisma/client.ts";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "..", "dev.db");

const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@pantiasuhan.org" },
    update: {},
    create: {
      name: "Admin Panti",
      email: "admin@pantiasuhan.org",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create sample campaigns
  const campaigns = await Promise.all([
    prisma.campaign.create({
      data: {
        title: "Renovasi Atap Asrama Putra",
        description:
          "Atap asrama putra sudah bocor di beberapa titik dan perlu diperbaiki segera agar anak-anak bisa tidur dengan nyaman saat musim hujan.",
        targetAmount: 15000000,
        currentAmount: 4500000,
        status: "ACTIVE",
      },
    }),
    prisma.campaign.create({
      data: {
        title: "Beasiswa Pendidikan 2026",
        description:
          "Program beasiswa untuk 20 anak panti yang berprestasi agar dapat melanjutkan pendidikan ke jenjang SMA dan Perguruan Tinggi.",
        targetAmount: 50000000,
        currentAmount: 12000000,
        status: "ACTIVE",
      },
    }),
    prisma.campaign.create({
      data: {
        title: "Kebutuhan Pangan Bulanan",
        description:
          "Dana untuk memenuhi kebutuhan makan sehari-hari bagi 45 anak penghuni panti selama satu bulan penuh.",
        targetAmount: 8000000,
        currentAmount: 6200000,
        status: "ACTIVE",
      },
    }),
    prisma.campaign.create({
      data: {
        title: "Perlengkapan Sekolah",
        description:
          "Pengadaan seragam, tas, sepatu, dan alat tulis untuk tahun ajaran baru bagi seluruh anak panti.",
        targetAmount: 10000000,
        currentAmount: 10000000,
        status: "COMPLETED",
      },
    }),
  ]);
  console.log(`✅ ${campaigns.length} campaigns created`);

  // Create sample money donations
  const donations = await Promise.all([
    prisma.moneyDonation.create({
      data: {
        donorName: "Budi Santoso",
        amount: 500000,
        paymentMethod: "Bank Transfer",
        message: "Semoga bermanfaat untuk anak-anak.",
        status: "SUCCESS",
        campaignId: campaigns[0].id,
      },
    }),
    prisma.moneyDonation.create({
      data: {
        donorName: "Hamba Allah",
        amount: 1000000,
        paymentMethod: "GoPay",
        message: "",
        status: "SUCCESS",
        campaignId: campaigns[1].id,
      },
    }),
    prisma.moneyDonation.create({
      data: {
        donorName: "Siti Aminah",
        amount: 250000,
        paymentMethod: "Bank Transfer",
        message: "Untuk anak-anak yatim piatu.",
        status: "PENDING",
        campaignId: campaigns[2].id,
      },
    }),
  ]);
  console.log(`✅ ${donations.length} money donations created`);

  // Create sample item donations
  const itemDonations = await Promise.all([
    prisma.itemDonation.create({
      data: {
        donorName: "Ibu Kartini",
        donorPhone: "081234567890",
        itemName: "Beras",
        quantity: "50 Kg",
        description: "Beras premium kualitas A",
        deliveryMethod: "Diantar Langsung",
        status: "RECEIVED",
        receivedAt: new Date(),
      },
    }),
    prisma.itemDonation.create({
      data: {
        donorName: "Pak Ahmad",
        donorPhone: "089876543210",
        itemName: "Buku Pelajaran",
        quantity: "30 Buah",
        description: "Buku matematika dan IPA untuk SD",
        deliveryMethod: "Kurir",
        status: "PENDING",
      },
    }),
  ]);
  console.log(`✅ ${itemDonations.length} item donations created`);

  // Create sample expenses
  const expenses = await Promise.all([
    prisma.expense.create({
      data: {
        title: "Pembayaran Listrik Juni 2026",
        amount: 850000,
        date: new Date("2026-06-01"),
        description: "Tagihan listrik bulanan untuk seluruh area panti.",
      },
    }),
    prisma.expense.create({
      data: {
        title: "Belanja Bahan Makanan Minggu ke-1",
        amount: 1200000,
        date: new Date("2026-06-05"),
        description: "Beras, lauk-pauk, sayuran, dan bumbu dapur.",
      },
    }),
    prisma.expense.create({
      data: {
        title: "Biaya Transportasi Anak Sekolah",
        amount: 400000,
        date: new Date("2026-06-02"),
        description: "Ongkos angkutan dan bensin untuk antar-jemput sekolah.",
      },
    }),
  ]);
  console.log(`✅ ${expenses.length} expenses created`);

  console.log("\n🎉 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

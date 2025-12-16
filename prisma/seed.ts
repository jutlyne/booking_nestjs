import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  const tables = [
    'room_booking_occurrence',
    'room_booking',
    'recurring_rules',
    'rooms',
    'locations',
    'teams',
    'users',
  ];

  await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0`);
  for (const tableName of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableName};`);
  }
  await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1`);

  const sAdmin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      fullname: 'Supper Admin',
      password: 'Matkhau@123',
      phone: 1234567890,
      role: 'admin',
    },
  });
  console.log({ sAdmin });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

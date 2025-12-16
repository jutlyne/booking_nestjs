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

  const locations = [
    {
      name: 'Đà Nẵng',
      address: '218 Bạch Đằng, Hải Châu, Đà Nẵng',
      rooms: [
        {
          name: 'Phòng họp 1',
        },
        {
          name: 'Phòng họp 2',
        },
        {
          name: 'Phòng họp 3',
        },
      ],
    },
    {
      name: 'Huế',
      address: '28 Lý Thường Kiệt, Thuận Hóa, Huế',
      rooms: [
        {
          name: 'Phòng họp 1',
        },
      ],
    },
  ];

  for (const location of locations) {
    await prisma.location.upsert({
      where: { name: location.name },
      update: {},
      create: {
        name: location.name,
        address: location.address,
        rooms: {
          create: location.rooms.map((room) => ({
            name: room.name,
          })),
        },
      },
    });
  }

  console.log({ sAdmin });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

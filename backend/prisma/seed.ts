import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean database (fresh start)
  await prisma.saleItem.deleteMany({});
  await prisma.sale.deleteMany({});
  await prisma.inventoryMovement.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. ═══════════════════════════════════════════════════════════
  //    SEED USERS
  // ═══════════════════════════════════════════════════════════
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@wholesale.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const sales = await prisma.user.create({
    data: {
      name: 'Sales Representative',
      email: 'sales@wholesale.com',
      passwordHash,
      role: 'SALES',
    },
  });

  const warehouse = await prisma.user.create({
    data: {
      name: 'Warehouse Manager',
      email: 'warehouse@wholesale.com',
      passwordHash,
      role: 'WAREHOUSE',
    },
  });

  const accounts = await prisma.user.create({
    data: {
      name: 'Accounts Officer',
      email: 'accounts@wholesale.com',
      passwordHash,
      role: 'ACCOUNTS',
    },
  });

  console.log('✅ Users seeded successfully!');

  // 2. ═══════════════════════════════════════════════════════════
  //    SEED CATEGORIES & PRODUCTS
  // ═══════════════════════════════════════════════════════════
  const electronics = await prisma.category.create({
    data: { name: 'Electronics' },
  });

  const textiles = await prisma.category.create({
    data: { name: 'Textiles' },
  });

  const groceries = await prisma.category.create({
    data: { name: 'Groceries' },
  });

  const furniture = await prisma.category.create({
    data: { name: 'Furniture' },
  });

  const products = await Promise.all([
    prisma.product.create({
      data: {
        categoryId: electronics.id,
        sku: 'ELEC-001',
        name: 'USB-C Charging Cable (1m)',
        price: 150,
        currentStock: 450,
        minimumStock: 100,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: electronics.id,
        sku: 'ELEC-002',
        name: 'Wireless Keyboard',
        price: 2500,
        currentStock: 85,
        minimumStock: 20,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: electronics.id,
        sku: 'ELEC-003',
        name: 'USB 3.0 Hub (4-port)',
        price: 1200,
        currentStock: 120,
        minimumStock: 30,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: textiles.id,
        sku: 'TEXT-001',
        name: 'Cotton T-Shirt (XL)',
        price: 400,
        currentStock: 500,
        minimumStock: 150,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: textiles.id,
        sku: 'TEXT-002',
        name: 'Polyester Blend Shirt',
        price: 650,
        currentStock: 280,
        minimumStock: 100,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: groceries.id,
        sku: 'GROC-001',
        name: 'Basmati Rice (10kg)',
        price: 450,
        currentStock: 200,
        minimumStock: 50,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: groceries.id,
        sku: 'GROC-002',
        name: 'Cooking Oil (5L)',
        price: 550,
        currentStock: 150,
        minimumStock: 40,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: furniture.id,
        sku: 'FURN-001',
        name: 'Ergonomic Office Chair',
        price: 8500,
        currentStock: 15,
        minimumStock: 5,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: furniture.id,
        sku: 'FURN-002',
        name: 'Wooden Desk (1200x600mm)',
        price: 12000,
        currentStock: 8,
        minimumStock: 3,
      },
    }),
  ]);

  console.log('✅ Products seeded successfully!');

  // 3. ═══════════════════════════════════════════════════════════
  //    SEED CUSTOMERS
  // ═══════════════════════════════════════════════════════════
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        businessName: 'Tech Distributors Ltd.',
        contactName: 'Rajesh Kumar',
        email: 'rajesh@techdist.com',
        phone: '9876543210',
        gstNumber: '18AABCU1234H1Z0',
        address: '123 Electronics Plaza, Mumbai, MH 400001',
        status: 'ACTIVE',
        notes: 'Preferred distributor for electronics',
      },
    }),
    prisma.customer.create({
      data: {
        businessName: 'Fashion & Apparel Co.',
        contactName: 'Priya Singh',
        email: 'priya@fashionco.com',
        phone: '9876543211',
        gstNumber: '27AABCU5678H2Z0',
        address: '456 Textile Market, Bangalore, KA 560001',
        status: 'ACTIVE',
        notes: 'Regular bulk orders',
      },
    }),
    prisma.customer.create({
      data: {
        businessName: 'Grocery Wholesale Hub',
        contactName: 'Amit Patel',
        email: 'amit@groceryhub.com',
        phone: '9876543212',
        gstNumber: '24AABCU9012H3Z0',
        address: '789 Market Street, Delhi, DL 110001',
        status: 'ACTIVE',
        notes: 'Large volume quarterly orders',
      },
    }),
    prisma.customer.create({
      data: {
        businessName: 'Office Solutions Ltd.',
        contactName: 'Neha Verma',
        email: 'neha@officesol.com',
        phone: '9876543213',
        gstNumber: '06AABCU3456H4Z0',
        address: '321 Corporate Avenue, Pune, MH 411001',
        status: 'ACTIVE',
        notes: 'Furniture and office supplies',
      },
    }),
    prisma.customer.create({
      data: {
        businessName: 'Rural Supply Store',
        contactName: 'Suresh Kumar',
        email: 'suresh@ruralstore.com',
        phone: '9876543214',
        gstNumber: '32AABCU7890H5Z0',
        address: '555 Village Market, Hyderabad, TG 500001',
        status: 'ACTIVE',
        notes: 'Seasonal demand varies',
      },
    }),
  ]);

  console.log('✅ Customers seeded successfully!');

  // 4. ═══════════════════════════════════════════════════════════
  //    SEED SALES
  // ═══════════════════════════════════════════════════════════
  const sale1 = await prisma.sale.create({
    data: {
      customerId: customers[0].id,
      createdById: sales.id,
      challanNumber: `CH-${Date.now()}-001`,
      totalAmount: 0,
      status: 'CONFIRMED',
      notes: 'Regular tech supply shipment',
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 50,
            unitPrice: products[0].price,
            totalPrice: 50 * products[0].price,
          },
          {
            productId: products[2].id,
            quantity: 25,
            unitPrice: products[2].price,
            totalPrice: 25 * products[2].price,
          },
        ],
      },
    },
  });

  const sale1Total = (50 * products[0].price) + (25 * products[2].price);
  await prisma.sale.update({
    where: { id: sale1.id },
    data: { totalAmount: sale1Total },
  });

  const sale2 = await prisma.sale.create({
    data: {
      customerId: customers[1].id,
      createdById: sales.id,
      challanNumber: `CH-${Date.now()}-002`,
      totalAmount: 0,
      status: 'CONFIRMED',
      notes: 'Fashion items bulk order',
      items: {
        create: [
          {
            productId: products[3].id,
            quantity: 100,
            unitPrice: products[3].price,
            totalPrice: 100 * products[3].price,
          },
          {
            productId: products[4].id,
            quantity: 75,
            unitPrice: products[4].price,
            totalPrice: 75 * products[4].price,
          },
        ],
      },
    },
  });

  const sale2Total = (100 * products[3].price) + (75 * products[4].price);
  await prisma.sale.update({
    where: { id: sale2.id },
    data: { totalAmount: sale2Total },
  });

  console.log('✅ Sales seeded successfully!');

  console.log('\n📊 Seeding completed!\n');
  console.table([
    { Role: 'Admin', Email: 'admin@wholesale.com', Password: 'password123' },
    { Role: 'Sales', Email: 'sales@wholesale.com', Password: 'password123' },
    { Role: 'Warehouse', Email: 'warehouse@wholesale.com', Password: 'password123' },
    { Role: 'Accounts', Email: 'accounts@wholesale.com', Password: 'password123' },
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('✨ All done!');
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

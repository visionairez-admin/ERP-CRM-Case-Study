import { prisma } from '../../config/prisma';

export const getDashboardMetrics = async () => {
  const [
    totalCustomers,
    totalProducts,
    totalSales,
    salesData,
    recentSales,
    lowStockProducts
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.product.count(),
    prisma.sale.count(),
    prisma.sale.aggregate({
      _sum: { totalAmount: true },
    }),
    prisma.sale.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { customer: { select: { businessName: true } } },
    }),
    prisma.product.findMany({
      where: {
        currentStock: { lte: prisma.product.fields.minimumStock },
      },
      take: 5,
      select: { name: true, sku: true, currentStock: true, minimumStock: true },
    })
  ]);

  return {
    metrics: {
      totalCustomers,
      totalProducts,
      totalSales,
      totalRevenue: salesData._sum.totalAmount || 0,
    },
    recentSales,
    lowStockProducts,
  };
};

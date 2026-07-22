import * as saleRepository from './sale.repository';
import { NotFoundError } from '../../utils/errors';

export const getSales = async (page = 1, limit = 10, customerId?: string) => {
  return saleRepository.findAllSales(page, limit, customerId);
};

export const getSaleById = async (id: string) => {
  const sale = await saleRepository.findSaleById(id);
  if (!sale) throw new NotFoundError('Sale challan not found');
  return sale;
};

export const createSale = async (
  customerId: string,
  userId: string,
  notes: string | undefined,
  items: { productId: string; quantity: number }[]
) => {
  return saleRepository.createSale(customerId, userId, notes, items);
};

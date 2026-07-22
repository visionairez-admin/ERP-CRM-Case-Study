import { Prisma } from '@prisma/client';
import * as productRepository from './product.repository';
import { NotFoundError, BadRequestError } from '../../utils/errors';

export const getCategories = async () => productRepository.findAllCategories();

export const createCategory = async (name: string) => {
  try {
    return await productRepository.createCategory(name);
  } catch (error: any) {
    if (error.code === 'P2002') throw new BadRequestError('Category name already exists');
    throw error;
  }
};

export const getProducts = async (page = 1, limit = 10, search?: string, categoryId?: string) =>
  productRepository.findAllProducts(page, limit, search, categoryId);

export const getProductById = async (id: string) => {
  const product = await productRepository.findProductById(id);
  if (!product) throw new NotFoundError('Product not found');
  return product;
};

export const createProduct = async (data: Prisma.ProductUncheckedCreateInput) => {
  const category = await productRepository.findCategoryById(data.categoryId);
  if (!category) throw new BadRequestError('Invalid category ID');

  try {
    return await productRepository.createProduct(data as any);
  } catch (error: any) {
    if (error.code === 'P2002') throw new BadRequestError('Product SKU already exists');
    throw error;
  }
};

export const updateProduct = async (id: string, data: Prisma.ProductUncheckedUpdateInput) => {
  const product = await productRepository.findProductById(id);
  if (!product) throw new NotFoundError('Product not found');

  if (data.categoryId) {
    const category = await productRepository.findCategoryById(data.categoryId as string);
    if (!category) throw new BadRequestError('Invalid category ID');
  }

  try {
    return await productRepository.updateProduct(id, data as any);
  } catch (error: any) {
    if (error.code === 'P2002') throw new BadRequestError('Product SKU already exists');
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  const product = await productRepository.findProductById(id);
  if (!product) throw new NotFoundError('Product not found');
  return productRepository.removeProduct(id);
};

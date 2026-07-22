import { Prisma } from '@prisma/client';
import * as customerRepository from './customer.repository';
import { NotFoundError } from '../../utils/errors';

export const getAllCustomers = async (page = 1, limit = 10, search?: string) => {
  return customerRepository.findAll(page, limit, search);
};

export const getCustomerById = async (id: string) => {
  const customer = await customerRepository.findById(id);
  if (!customer) throw new NotFoundError('Customer not found');
  return customer;
};

export const createCustomer = async (data: Prisma.CustomerCreateInput) => {
  return customerRepository.create(data);
};

export const updateCustomer = async (id: string, data: Prisma.CustomerUpdateInput) => {
  const customer = await customerRepository.findById(id);
  if (!customer) throw new NotFoundError('Customer not found');
  return customerRepository.update(id, data);
};

export const deleteCustomer = async (id: string) => {
  const customer = await customerRepository.findById(id);
  if (!customer) throw new NotFoundError('Customer not found');
  return customerRepository.remove(id);
};

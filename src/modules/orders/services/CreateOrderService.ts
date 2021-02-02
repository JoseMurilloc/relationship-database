import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const existCustomer = await this.customersRepository.findById(customer_id);

    if (!existCustomer) {
      throw new AppError('Not exist customers');
    }

    const existProducts = await this.productsRepository.findAllById(products);

    if (!existProducts.length) {
      throw new AppError('Could not find any product with the given ids');
    }

    const existProductsIds = existProducts.map(p => p.id);
    const checkInExistProducts = products.filter(
      p => !existProductsIds.includes(p.id),
    );

    if (checkInExistProducts.length) {
      throw new AppError(
        `Could not find product ${checkInExistProducts[0].id}`,
      );
    }

    const findProductWithNoQuantityAvailable = products.filter(
      p => existProducts.filter(ex => ex.id === p.id)[0].quantity <= p.quantity,
    );

    if (findProductWithNoQuantityAvailable.length) {
      throw new AppError(
        `The quantity ${findProductWithNoQuantityAvailable[0].quantity} is not available for ${findProductWithNoQuantityAvailable[0].id}`,
      );
    }

    const serializeProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existProducts.filter(p => p.id === product.id)[0].price,
    }));

    const order = this.ordersRepository.create({
      products: serializeProducts,
      customer: existCustomer,
    });

    const orderedProductsQuantity = products.map(product => ({
      id: product.id,
      quantity:
        existProducts.filter(p => p.id === product.id)[0].quantity -
        product.quantity,
    }));

    await this.productsRepository.updateQuantity(orderedProductsQuantity);

    return order;
  }
}

export default CreateOrderService;

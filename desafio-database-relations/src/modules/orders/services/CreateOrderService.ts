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
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer does not exists');
    }

    const findProducts = await this.productsRepository.findAllById(
      products.map(product => ({ id: product.id })),
    );

    const order_products = products.map(product => {
      const findProduct = findProducts.find(item => item.id === product.id);

      if (!findProduct) {
        throw new AppError('One or many invalid products.');
      }

      if (findProduct.quantity < product.quantity) {
        throw new AppError('Product out of stock.');
      }

      findProduct.quantity -= product.quantity;

      return {
        product_id: product.id,
        quantity: product.quantity,
        price: findProduct.price,
      };
    });

    const order = await this.ordersRepository.create({
      customer,
      products: order_products,
    });

    await this.productsRepository.updateQuantity(findProducts);

    return order;
  }
}

export default CreateOrderService;

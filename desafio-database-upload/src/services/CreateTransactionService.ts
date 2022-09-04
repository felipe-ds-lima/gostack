import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('You cannot make a outcome greater than the total');
    }

    const transaction = transactionsRepository.create({ title, value, type });

    await transactionsRepository.save(transaction);

    const categoryExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (categoryExists) {
      transaction.category = categoryExists;
    } else {
      const newCategory = categoriesRepository.create({ title: category });

      await categoriesRepository.save(newCategory);

      transaction.category = newCategory;
    }

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

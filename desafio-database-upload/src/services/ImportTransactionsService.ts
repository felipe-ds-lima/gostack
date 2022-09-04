import fs from 'fs';
import csv from 'csv-parse';
import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  filePath: string;
}

interface TransactionCSV {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

interface CategoryCSV {
  title: string;
}

class ImportTransactionsService {
  async execute({ filePath }: Request): Promise<Transaction[]> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const readCSVStream = fs.createReadStream(filePath);
    const parseStream = csv({
      from_line: 2,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const transactionsCSV: TransactionCSV[] = [];
    const categoriesCSV: CategoryCSV[] = [];

    parseCSV.on('data', line => {
      const [title, type, value, category] = line;

      if (!title || !type || !value || !category) {
        return;
      }

      transactionsCSV.push({
        title: title.trim(),
        type: type.trim(),
        value: Number(value.trim()),
        category: category.trim(),
      });
      if (
        !categoriesCSV.some(
          hasCategory => hasCategory.title === category.trim(),
        )
      )
        categoriesCSV.push({ title: category.trim() });
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const categories = await Promise.all(
      categoriesCSV.map(async ({ title }) => {
        const categoryExists = await categoriesRepository.findOne({
          where: { title },
        });

        if (categoryExists) {
          return categoryExists;
        }

        const category = categoriesRepository.create({ title });
        return categoriesRepository.save(category);
      }),
    );

    const transactions = await Promise.all(
      transactionsCSV.map(async ({ title, value, type, category }) => {
        const categoryDB = categories.find(
          categorySearch => categorySearch.title === category,
        );
        const transaction = transactionsRepository.create({
          title,
          value,
          type,
          category: categoryDB,
        });

        return transactionsRepository.save(transaction);
      }),
    );

    return transactions;
  }
}

export default ImportTransactionsService;

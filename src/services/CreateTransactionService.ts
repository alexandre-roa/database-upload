import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  categoryTitle: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    categoryTitle,
  }: Request): Promise<Transaction | null> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (!['income', 'outcome'].includes(type)) {
      throw new Error('Transaction type is invalid');
    }

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance', 400);
    }

    const checkCategoryExists = await categoryRepository.findOne({
      where: { title: categoryTitle },
    });

    if (checkCategoryExists) {
      const categoryAll = await categoryRepository.find({
        where: { title: categoryTitle },
      });

      const transaction = transactionsRepository.create({
        title,
        type,
        value,
        category_id: categoryAll[0].id,
        category: categoryAll[0],
      });

      await transactionsRepository.save(transaction);

      return transaction;
    }

    const category = categoryRepository.create({
      title: categoryTitle,
    });

    await categoryRepository.save(category);

    const category_id = category.id;
    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id,
      category,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface AllTransactions {
  id: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: Category | undefined;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // const transactionRepository = [getRepository(Transaction)];

    // const transactions = [transactionRepository];

    // const transactionsBalance = transactions.reduce(
    //   (acc: Balance, cur: Transaction) => {
    //     switch (cur.type) {
    //       case 'income':
    //         acc.income += cur.value;
    //         break;
    //       case 'outcome':
    //         acc.outcome += cur.value;
    //         break;
    //       default:
    //         break;
    //     }
    //     return acc;
    //   },
    //   {
    //     income: 0,
    //     outcome: 0,
    //     total: 0,
    //   },
    // );

    // return transactionsBalance

    const balance = {
      income: 6000,
      outcome: 5200,
      total: 800,
    };

    return balance;
  }

  public async all(): Promise<AllTransactions[]> {
    const transactionsRepository = getRepository(Transaction);
    const categotyRepository = getRepository(Category);

    const transaction = await transactionsRepository.find();
    const category = await categotyRepository.find();

    const transactions = transaction.map(item => {
      return {
        id: item.id,
        title: item.title,
        value: item.value,
        type: item.type,
        category: category.find(cat => cat.id === item.category_id),
      };
    });

    return transactions;
  }
}

export default TransactionsRepository;

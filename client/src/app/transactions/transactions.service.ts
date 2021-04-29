import { Injectable } from '@angular/core';

interface ITransactionsService {
  merchant: string;
  readonly transactionsUrl: string;
  filterTransactionData(transactions: Array<any>): Array<any>;
  checkIfThereAreTransactions(count: number): boolean;
  findFavouriteMerchant(arr: Array<any>): string;
  topPurchases(transactions: Array<any>, count: number): Array<any>;
  getTransactionCurrency(transactions: Array<any>): string;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionsService implements ITransactionsService {
  private categoryType = 'EXPENSES';
  private _transactionsUrl = 'http://localhost:8080/transactions';
  private _merchant = '';
  constructor() {}

  get merchant(): string {
    return this._merchant;
  }

  set merchant(name: string) {
    this._merchant = name;
  }

  get transactionsUrl(): string {
    return this._transactionsUrl;
  }

  filterTransactionData(transactions: Array<any>): Array<any> {
    return transactions
      .map((el: any) => {
        return el.transaction;
      })
      .filter((el: any) => {
        return el.categoryType === this.categoryType;
      })
      .map((el: any) => {
        el.amount = Math.abs(el.amount);

        return el;
      });
  }

  checkIfThereAreTransactions(count: number): boolean {
    return !!count;
  }

  findFavouriteMerchant(arr: Array<any>): string {
    this._merchant = arr
      .sort(
        (a, b) =>
          arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
      )
      .pop();

    return this.merchant;
  }

  calculateTotal(transactions: Array<any>): number {
    return transactions
      .filter((el: any) => {
        return el.formattedDescription === this.merchant;
      })
      .reduce((prev, cur) => {
        return prev + cur.amount;
      }, 0);
  }

  topPurchases(transactions: Array<any>, count: number): Array<any> {
    return transactions
      .map((el: any) => {
        const { date, amount, formattedDescription: merchant } = el;

        return {
          date: new Date(date).toLocaleString(),
          amount,
          merchant,
        };
      })
      .sort((a: any, b: any) => {
        return b.amount - a.amount;
      })
      .slice(0, count);
  }

  getTransactionCurrency(transactions: Array<any>): string {
    return transactions[0]?.currencyDenominatedAmount.currencyCode;
  }
}

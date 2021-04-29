import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { TransactionsService } from './transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.less'],
})
export class TransactionsComponent implements OnInit {
  transactionData: Array<any> = [];
  merchantName = '';
  total = 0;
  topPurchases: Array<any> = [];
  isTransactionsData = false;
  isLoading = false;
  currency = '';
  retryCount = 2;

  constructor(
    private apiService: ApiService,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit(): void {
    this.merchantName = this.transactionsService.merchant;
    this.getAccountData();
  }

  getAccountData(): void {
    this.isLoading = true;

    this.apiService
      .get<any>(this.transactionsService.transactionsUrl)
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.transactionData = res.response.transactionData.results;

          this.transactionData = this.transactionsService.filterTransactionData(
            this.transactionData
          );

          this.isTransactionsData = this.transactionsService.checkIfThereAreTransactions(
            res.response.transactionData.count
          );

          // workaround sometimes API sends data on second call
          if (!this.isTransactionsData && this.retryCount) {
            this.retryCount--;
            this.getAccountData();
          }

          this.merchantName = this.transactionsService.findFavouriteMerchant(
            this.transactionData.map((el: any) => {
              return el.formattedDescription;
            })
          );

          this.total = this.transactionsService.calculateTotal(
            this.transactionData
          );

          this.topPurchases = this.transactionsService.topPurchases(
            this.transactionData,
            3
          );

          this.currency = this.transactionsService.getTransactionCurrency(
            this.transactionData
          );
        },
        (error: any) => {
          this.isLoading = false;
          console.log(error);
        }
      );
  }
}

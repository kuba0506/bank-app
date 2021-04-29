import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { TransactionsService } from './transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.less'],
})
export class TransactionsComponent implements OnInit {
  transactionData: Array<any>;
  merchant: string;
  maxSum = 0;
  topThreePurchases: Array<any> = [];
  noTransactions = true;
  isLoading = true;
  currency = '';

  constructor(
    private apiService: ApiService,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit(): void {
    this.merchant = this.transactionsService.merchant;
    this.getAccountData();
  }

  getAccountData(): void {
    this.isLoading = false;

    this.apiService.get<any>(this.transactionsService.transactionsUrl).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.transactionData = res.response.transactionData.results;

        this.transactionData = this.transactionsService.filterTransaction(
          this.transactionData
        );

        this.noTransactions = this.transactionsService.checkIfTheAreTransactions(
          this.transactionData
        );

        // workaround sometimes API sends data on second call
        if (this.noTransactions) {
          window.location.reload();
        }

        this.merchant = this.transactionsService.mostOccurentMerchant(
          this.transactionData.map((el: any) => {
            return el.formattedDescription;
          })
        );

        this.maxSum = this.transactionsService.calculateMaxSum(
          this.transactionData
        );

        this.topThreePurchases = this.transactionsService.topPurchases(
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

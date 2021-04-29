import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.less'],
})
export class TransactionsComponent implements OnInit {
  transactionData: any;
  private categoryType = 'EXPENSES';
  mostOccurenceMerchant: any;
  maxSum: any;
  topThree: any;
  noTransactions = true;
  isLoading = true;
  currency = '';
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getAccountData();
  }

  getAccountData(): void {
    this.isLoading = false;
    this.apiService.get<any>('http://localhost:8080/transactions').subscribe(
      (res: any) => {
        this.isLoading = false;
        this.transactionData = res.response.transactionData.results;

        this.transactionData = this.transactionData
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

        this.noTransactions = this.checkIfTheAreTransactions(
          this.transactionData
        );

        // workaround sometimes API sends data on second call
        if (this.noTransactions) {
          window.location.reload();
        }

        function mode(arr) {
          return arr
            .sort(
              (a, b) =>
                arr.filter((v) => v === a).length -
                arr.filter((v) => v === b).length
            )
            .pop();
        }

        this.mostOccurenceMerchant = mode(
          this.transactionData.map((el: any) => {
            return el.formattedDescription;
          })
        );

        this.maxSum = this.transactionData
          .filter((el: any) => {
            return el.formattedDescription === this.mostOccurenceMerchant;
          })
          .reduce((prev, cur) => {
            console.log(prev);
            return prev + cur.amount;
          }, 0);

        this.topThree = this.transactionData
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
          .slice(0, 3);

        this.currency = this.transactionData[0].currencyDenominatedAmount.currencyCode;

        this.calculateExpenses(this.transactionData);
      },
      (error: any) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  calculateExpenses(transcations: any): void {
    // amount
    // formattedDescription
    // categoryType
    // const filteredTransactions
  }

  checkIfTheAreTransactions(data: Array<any>): boolean {
    return data.length === 0 ? true : false;
  }
}

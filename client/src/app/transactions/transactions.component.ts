import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.less'],
})
export class TransactionsComponent implements OnInit {
  transactionData: any;
  accountData: any;
  private categoryType = 'EXPENSES';
  mostOccurenceMerchant: any;
  maxSum: any;
  topThree: any;
  noTransactions: boolean = true;
  isLoading = true;
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getAccountData();
  }

  getAccountData(): void {
    this.apiService.get<any>('http://localhost:8080/transactions').subscribe(
      (res: any) => {
        this.accountData = res.response.accountData;
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
            // return el.formattedDescription;
          });

        this.noTransactions = this.checkIfTheAreTransactions(
          this.transactionData
        );

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

        this.topThree = this.transactionData.slice(0, 3).map((el: any) => {
          const { date, amount, formattedDescription: merchant } = el;

          return {
            date: new Date(date).toLocaleString(),
            amount,
            merchant,
          };
        });

        console.log(this.accountData);
        console.log(this.transactionData);
        // this.isNoData
        console.log(this.mostOccurenceMerchant);
        console.log(this.maxSum);
        console.log(this.topThree);

        this.calculateExpenses(this.transactionData);
        this.isLoading = false;
      },
      (error: any) => {
        console.log(error);
        this.isLoading = false;
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

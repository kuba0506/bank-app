import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.less'],
})
export class TransactionsComponent implements OnInit {
  transactions: any;
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getAccountData();
  }

  getAccountData(): void {
    this.apiService
      .get<any>('http://localhost:8080/transactions')
      .subscribe((res: any) => {
        console.log(res);
        this.transactions = res;
      });
  }
}

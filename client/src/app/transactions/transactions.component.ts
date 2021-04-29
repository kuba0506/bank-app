import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.less'],
})
export class TransactionsComponent implements OnInit {
  token: string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
          this.token = params["token"];
          console.log('token: ', this.token)
        });
  }
}

import { Component, OnInit } from '@angular/core';
import { IOption } from '../shared/dropdown/dropdown.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  market: string;
  locale: string;

  onSelect(option: IOption): void {
    this[option.name] = option.value;
  }

  ngOnInit(): void {
    this.market = '';
    this.locale = '';
  }
}

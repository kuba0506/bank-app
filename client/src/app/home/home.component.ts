import { Component, OnInit } from '@angular/core';
import { IOption } from '../shared/dropdown/dropdown.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  selectedOptions: Set<IOption> = new Set();
  market: string;
  locale: string;
  constructor() {}

  onSelect(option: IOption): void {
    console.log('home', option, option.name);
    this[option.name] = option.value;
  }

  ngOnInit(): void {
    this.market = '';
    this.locale = '';
  }
}

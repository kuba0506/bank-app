import { Component, OnInit } from '@angular/core';
import { IOption } from '../dropdown/dropdown.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
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

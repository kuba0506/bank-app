import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.less'],
})
export class DropdownComponent implements OnInit {
  @Input() label: string;
  @Input() options: Array<string>;

  constructor() {}

  ngOnInit(): void {}

  onSelect(option): void {
    console.log('Selected option: ', option);
  }
}

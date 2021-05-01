import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

export interface IOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
})
export class DropdownComponent {
  @Input() label: string;
  @Input() options: Array<string>;
  @Output() optionSelected = new EventEmitter<IOption>();

  onSelect(option: IOption): void {
    this.label = Object.values(option).join('');
    this.optionSelected.emit(option);
  }
}

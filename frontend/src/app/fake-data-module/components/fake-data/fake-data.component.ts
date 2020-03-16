import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'pp-fake-data',
  templateUrl: './fake-data.component.html',
  styleUrls: ['./fake-data.component.scss'],
})
export class FakeDataComponent implements OnChanges {
  @Input() public minWidth: number = 100;
  @Input() public maxWidth: number = 220;
  @Input() public lineHeight: number = 16;
  @Input() public fontSize: number = 16;
  public width: number;
  public margin;

  public ngOnChanges(changes: SimpleChanges): void {
    this.width = this.drawNumberBetween(this.minWidth, this.maxWidth);
    this.margin = this.lineHeight - this.fontSize;
  }

  private drawNumberBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pp-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() public text: string;
}

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-path-point-selector',
  templateUrl: './path-point-selector.component.html',
  styleUrls: ['./path-point-selector.component.scss']
})
export class PathPointSelectorComponent {
  isHolding = false;
  holdInterval: any;
  holdTimeout: any;
  holdDirection: number = 0;

  @Input()
  maxValue: number = 0;

  @Input() currentValue: number = 0;
  @Output() currentValueChange = new EventEmitter<number>();

  updateIndexChanged() {
    this.currentValueChange.emit(this.currentValue);
  }

  holdMouse(direction: number) {
    this.isHolding = true;
    this.holdDirection = direction;
    this.holdTimeout = setTimeout(() => {
      this.holdInterval = setInterval(() => {
        this.moveByHoldDirection();
      }, 100);
    }, 500);
  }

  moveByHoldDirection() {
    if (this.holdDirection > 0) {
      this.moveToNextPoint();
    } else {
      this.moveToPreviousPoint();
    }
  }

  releaseMouse() {
    if (!this.isHolding) {
      return;
    }
    this.isHolding = false;
    clearTimeout(this.holdTimeout);
    clearInterval(this.holdInterval);
    this.moveByHoldDirection();
  }

  moveToPreviousPoint() {
    let newValue = this.currentValue - 1;
    this.currentValue = newValue < 0 ? 0 : newValue;
    this.updateIndexChanged();
  }

  moveToNextPoint() {
    let newValue = this.currentValue + 1;
    this.currentValue = newValue > this.maxValue ? this.maxValue : newValue;
    this.updateIndexChanged();
  }
}

import * as ng from 'angular2/core';
import * as rf from 'angular2-reflow';
import {ActionEvent} from '../events';
import './event-bus-listener.css!';

@ng.Component({
  selector: 'event-bus-listener',
  template: `
  <div class="event-bus-listener" [style.opacity]="opacity">
    <div class="container">
      {{action}}
    </div>
  </div>
  `
})
export class EventBusListener implements ng.OnInit, ng.OnDestroy {
  private action:string;
  private opacity:number = 0;
  private timeout:number = -1;
  private listener:rf.EventListener;

  constructor(@ng.Inject(rf.EVENT_BUS) private eventBus:rf.EventBus) {
  }

  ngOnInit() {
    this.listener = this.eventBus.addEventListener(ActionEvent.ACTION, (event:ActionEvent) => {
      if (this.timeout > -1) clearTimeout(this.timeout);

      this.action = event.action;
      this.opacity = 1;
      this.timeout = setTimeout(() => {
        this.opacity = 0;
        this.timeout = -1;
      }, 1200);
    })
  }

  ngOnDestroy() {
    this.listener.remove();
    this.listener = null;
  }
}
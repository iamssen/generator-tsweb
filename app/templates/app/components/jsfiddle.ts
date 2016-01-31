import * as ng from 'angular2/core';
import * as rf from 'angular2-reflow';
import * as rx from 'rxjs';
import {jsfiddle} from '../models';
import {ActionEvent} from '../events';
import {JSFIDDLE_SERVICE, JsFiddleService} from '../services';

@ng.Component({
  selector: 'content-jsfiddle',
  template: `
  <h1>Js Fiddle</h1>
  <ul>
    <li *ngFor="#fiddle of fiddles">
      <a (click)="openLink(fiddle.url)">
        {{fiddle.title}}
      </a>
    </li>
  </ul>
  `
})
export class JsFiddle implements ng.OnInit {
  private fiddles:jsfiddle.Fiddle[];

  constructor(@ng.Inject(JSFIDDLE_SERVICE) private jsfiddleService:JsFiddleService,
              @ng.Inject(rf.EVENT_BUS) private eventBus:rf.EventBus) {
  }

  openLink(url:string) {
    this.eventBus.dispatchEvent(new ActionEvent(ActionEvent.ACTION, `Open Fiddle Link: ${url}`));
  }

  ngOnInit() {
    let subscription = this.jsfiddleService
      .fiddles()
      .subscribe(
        x => this.fiddles = x,
        e => console.log(e),
        () => subscription && subscription.unsubscribe()
      )
  }
}
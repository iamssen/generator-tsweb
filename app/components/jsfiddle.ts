import * as ng from 'angular2/core';
import * as rx from 'rxjs';
import {jsfiddle} from '../models';
import {JSFIDDLE_SERVICE, JsFiddleService} from '../services';

@ng.Component({
  selector: 'content-jsfiddle',
  template: `
  <h1>Js Fiddle</h1>
  <ul>
    <li *ngFor="#fiddle of fiddles">
      <a href="{{fiddle.url}}" target="_blank">
        {{fiddle.title}}
      </a>
    </li>
  </ul>
  `
})
export class JsFiddle implements ng.OnInit {
  private fiddles:jsfiddle.Fiddle[];

  constructor(@ng.Inject(JSFIDDLE_SERVICE) private jsfiddleService:JsFiddleService) {
  }

  ngOnInit() {
    let subscription = this.jsfiddleService
      .fiddles()
      .subscribe(
        x => this.fiddles = x,
        e => console.log(e),
        () => subscription.unsubscribe()
      )
  }
}
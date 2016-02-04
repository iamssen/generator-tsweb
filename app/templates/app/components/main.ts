import * as ng from 'angular2/core';
import * as router from 'angular2/router';
import * as rf from 'angular2-reflow';
import {ContextFactory} from 'contexts:main';
import {Github} from "./github";
import {JsFiddle} from './jsfiddle';
import {Activity} from './activity';
import {EventBusListener} from './event-bus-listener';
import {ANALYTICS_SERVICE, AnalyticsService} from '../services';
import './main.css!';

let context:rf.ContextFactory = new ContextFactory;
let routeConfig:router.RouteDefinition[] = [
  {path: '/', name: 'Activities', component: Activity},
  {path: '/github', name: 'Github', component: Github},
  {path: '/jsfiddle', name: 'JS Fiddle', component: JsFiddle}
];

@ng.Component({
  selector: 'app-main',
  providers: [
    context.providers,
    router.ROUTER_PROVIDERS,
    ng.provide(router.LocationStrategy, {useClass: router.HashLocationStrategy})
  ],
  templateUrl: 'app/components/main.html',
  directives: [router.ROUTER_DIRECTIVES, EventBusListener]
})
@router.RouteConfig(routeConfig)
export class Main implements ng.OnInit, ng.OnDestroy {
  private routeConfig:router.RouteDefinition[];

  constructor(@ng.Inject(router.Location) private location:router.Location,
              @ng.Inject(rf.CONTEXT) private context:rf.Context,
              @ng.Inject(ANALYTICS_SERVICE) private analyticsService:AnalyticsService) {
    this.routeConfig = routeConfig;
  }

  ngOnInit() {
    this.context.start();
  }

  ngOnDestroy() {
    this.context.destroy();
  }

  isActive(path:string):boolean {
    //noinspection TypeScriptUnresolvedFunction
    if (this.location.path() === '' && path === '/') return true;
    //noinspection TypeScriptUnresolvedFunction
    return this.location.path() === path;
  }
}
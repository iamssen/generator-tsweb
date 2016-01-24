import {
    provide,
    Component,
    Inject,
    OnInit,
    OnDestroy
} from 'angular2/core';
import {
    ROUTER_PROVIDERS,
    ROUTER_DIRECTIVES,
    RouteConfig,
    LocationStrategy,
    HashLocationStrategy,
    Location,
    RouteDefinition
} from 'angular2/router';
import * as rf from 'angular2-reflow';
import {ContextFactory} from 'impl:context';
import {Index} from "../index/index";
import {Sample} from "../sample/sample";
import './main.css!';

let context:rf.ContextFactory = new ContextFactory;
let routeConfig:RouteDefinition[] = [
  {path: '/', name: 'Index', component: Index},
  {path: '/sample', name: 'Sample', component: Sample}
];

@Component({
  selector: 'app-main',
  providers: [
    context.providers,
    ROUTER_PROVIDERS,
    provide(LocationStrategy, {useClass: HashLocationStrategy})
  ],
  templateUrl: 'app/app/main/main.html',
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig(routeConfig)
export class Main implements OnInit, OnDestroy {
  private routeConfig:RouteDefinition[];

  constructor(@Inject(Location) private location:Location,
              @Inject(rf.CONTEXT) private context:rf.Context,
              @Inject(rf.EVENT_BUS) private eventBus:rf.EventBus) {
    this.routeConfig = routeConfig;
    eventBus.on('eventBusTest', this.eventHandler);
  }

  ngOnInit() {
    this.context.start();
  }

  ngOnDestroy() {
    this.context.destroy();
  }

  eventHandler(...args) {
    console.log('eventHandler...', args);
  }

  isActive(path:string):boolean {
    if (this.location.path() === '' && path === '/') return true;
    return this.location.path() === path;
  }
}
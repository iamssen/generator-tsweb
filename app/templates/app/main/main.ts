import {Component, View, provide} from 'angular2/core';
import {
	ROUTER_PROVIDERS,
	ROUTER_DIRECTIVES,
	RouteConfig,
	LocationStrategy,
	HashLocationStrategy,
	Location,
	RouteDefinition
} from 'angular2/router';
import {SampleModel} from "./main.models";
import {Index} from "../index/index";
import {Sample} from "../sample/sample";
import 'app/main/main.scss!';

let routeConfig:RouteDefinition[] = [
	{path: '/', name: 'Index', component: Index},
	{path: '/sample', name: 'Sample', component: Sample}
];

@Component({
	selector: 'app-main',
	providers: [
		ROUTER_PROVIDERS,
		provide(SampleModel, {useClass: SampleModel}),
		provide(LocationStrategy, {useClass: HashLocationStrategy})
	]
})
@View({
	templateUrl: 'app/main/main.html',
	directives: [ROUTER_DIRECTIVES]
})
@RouteConfig(routeConfig)
export class Main {
	private routeConfig:RouteDefinition[];

	constructor(private location:Location, private model:SampleModel) {
		this.routeConfig = routeConfig;
		model.appName = '<%= appname %>';
	}

	isActive(path:string):boolean {
		return this.location.path() === path;
	}
}
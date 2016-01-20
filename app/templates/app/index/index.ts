import {Component, View, Inject} from 'angular2/core';
import {SampleModel} from "../main/main.models";

@Component({
	selector: 'content-index'
})
@View({
	template: `<h1>hello {{model.appName}}</h1>`
})
export class Index {
	constructor(private model:SampleModel) {
	}
}
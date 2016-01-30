import * as ng from 'angular2/core';
import * as rf from 'angular2-reflow';
import {GITHUB_SERVICE, JSFIDDLE_SERVICE, ACTIVITY_SERVICE} from '../app/services';
import {GithubService, JsFiddleService, ActivityService} from '../app/services/services.web';

export class ContextFactory extends rf.ContextFactory {
  mapDependency() {
    this.provide(new ng.Provider(GITHUB_SERVICE, {useClass: GithubService}));
    this.provide(new ng.Provider(JSFIDDLE_SERVICE, {useClass: JsFiddleService}));
    this.provide(new ng.Provider(ACTIVITY_SERVICE, {useClass: ActivityService}));
  }
}
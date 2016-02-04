import * as ng from 'angular2/core';
import * as rf from 'angular2-reflow';
import {GITHUB_SERVICE, JSFIDDLE_SERVICE, ACTIVITY_SERVICE, ANALYTICS_SERVICE} from '../app/services';
import {GithubService, JsFiddleService, ActivityService, AnalyticsService} from '../app/services/services.electron';
import {ACTIVITY_STORE, ActivityStore} from '../app/stores';

export class ContextFactory extends rf.ContextFactory {
  mapDependency() {
    this.provide(new ng.Provider(ACTIVITY_STORE, {useClass: ActivityStore}));
    this.provide(new ng.Provider(GITHUB_SERVICE, {useClass: GithubService}));
    this.provide(new ng.Provider(JSFIDDLE_SERVICE, {useClass: JsFiddleService}));
    this.provide(new ng.Provider(ACTIVITY_SERVICE, {useClass: ActivityService}));
    this.provide(new ng.Provider(ANALYTICS_SERVICE, {useClass: AnalyticsService}));
  }
}
import * as ng from 'angular2/core';
import * as rx from 'rxjs';
import {github, jsfiddle, Activity} from './models';
import {ACTIVITY_STORE, ActivityStore} from './stores';

export const GITHUB_SERVICE:string = 'githubService';
export const JSFIDDLE_SERVICE:string = 'jsfiddleService';
export const ACTIVITY_SERVICE:string = 'activityService';

export interface GithubService {
  repositories():rx.Observable<github.Repository[]>;
  gists():rx.Observable<github.Gist[]>;
}

export interface JsFiddleService {
  fiddles():rx.Observable<jsfiddle.Fiddle[]>;
}

export class ActivityService {
  constructor(@ng.Inject(GITHUB_SERVICE) private githubService:GithubService,
              @ng.Inject(JSFIDDLE_SERVICE) private jsfiddleService:JsFiddleService,
              @ng.Inject(ACTIVITY_STORE) private activityStore:ActivityStore) {
  }

  activities():rx.Observable<Activity[]> {
    if (this.activityStore.activities) {
      return rx.Observable.of(this.activityStore.activities);
    }

    return rx.Observable.merge(
      this.githubService
        .repositories()
        .map<Activity[]>((repositories:github.Repository[]) => {
          return repositories.map(repository => {
            return {
              name: repository.name,
              date: new Date(repository.updated_at),
              from: 'github',
              github: repository
            }
          })
        }),
      this.githubService
        .gists()
        .map<Activity[]>((gists:github.Gist[]) => {
          return gists.map(gist => {
            return {
              name: gist.description,
              date: new Date(gist.updated_at),
              from: 'gist',
              gist: gist
            }
          })
        }),
      this.jsfiddleService
        .fiddles()
        .map<Activity[]>((fiddles:jsfiddle.Fiddle[]) => {
          return fiddles.map(fiddle => {
            return {
              name: fiddle.title,
              date: new Date(fiddle.created),
              from: 'jsfiddle',
              jsfiddle: fiddle
            }
          })
        })
      )
      .concatAll()
      .bufferCount(Infinity, Infinity)
      .do((activities:Activity[]) => this.activityStore.activities = activities)
  }
}
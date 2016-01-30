import * as rx from 'rxjs';
import {github, jsfiddle, Activity} from './models';

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

export interface ActivityService {
  activities():rx.Observable<Activity[]>;
}
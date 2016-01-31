import {Activity} from './models';

export const ACTIVITY_STORE:string = "activityStore";

const CACHE_LIFE:number = 1000 * 60; // a minute

export class ActivityStore {
  private _activities:Activity[];
  private _activitiesCached:number;

  get activities():Activity[] {
    if (this._activities && (+new Date - this._activitiesCached) > CACHE_LIFE) {
      this._activities = null;
    }
    return this._activities;
  }

  set activities(value:Array) {
    this._activitiesCached = +new Date;
    this._activities = value;
  }
}
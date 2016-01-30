import * as ng from 'angular2/core';
import * as rx from 'rxjs';
import * as service from '../services';
import {github, jsfiddle, Activity} from '../models';
import {GITHUB_USER_ID, JSFIDDLE_USER_ID} from '../consts';
import request from 'request';

function http<T>(req):rx.Observable<T> {
  return rx.Observable.fromPromise<T>(new Promise((resolve, reject) => {
    request(req, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(error);
      }
    })
  }));
}

function githubHttp<T>(url):rx.Observable<T> {
  return http<T>({
    url,
    headers: {
      'User-Agent': 'tsweb-http-request',
      'Authorization': `token cd4981226b72e9bffd3f8796026aa6865c81cb73`
    }
  });
}

export class GithubService implements service.GithubService {
  repositories():rx.Observable<github.Repository[]> {
    return githubHttp(`https://api.github.com/users/${GITHUB_USER_ID}/repos`);
  }

  gists():rx.Observable<github.Gist[]> {
    return githubHttp(`https://api.github.com/users/${GITHUB_USER_ID}/gists`);
  }
}

export class JsFiddleService implements service.JsFiddleService {
  fiddles():rx.Observable<jsfiddle.Fiddle[]> {
    return http(`http://jsfiddle.net/api/user/${JSFIDDLE_USER_ID}/demo/list.json`);
  }
}

export class ActivityService implements service.ActivityService {
  constructor(@ng.Inject(service.GITHUB_SERVICE) private githubService:service.GithubService,
              @ng.Inject(service.JSFIDDLE_SERVICE) private jsfiddleService:service.JsFiddleService) {
  }

  activities():rx.Observable<Activity[]> {
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
  }
}
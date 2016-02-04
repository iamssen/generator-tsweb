import * as ng from 'angular2/core';
import * as rx from 'rxjs';
import * as service from '../services';
import request from 'request';
import {github, jsfiddle, Activity} from '../models';
import {GITHUB_USER_ID, JSFIDDLE_USER_ID} from '../consts';

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

@ng.Injectable()
export class GithubService implements service.GithubService {
  repositories():rx.Observable<github.Repository[]> {
    return githubHttp(`https://api.github.com/users/${GITHUB_USER_ID}/repos`);
  }

  gists():rx.Observable<github.Gist[]> {
    return githubHttp(`https://api.github.com/users/${GITHUB_USER_ID}/gists`);
  }
}

@ng.Injectable()
export class JsFiddleService implements service.JsFiddleService {
  fiddles():rx.Observable<jsfiddle.Fiddle[]> {
    return http(`http://jsfiddle.net/api/user/${JSFIDDLE_USER_ID}/demo/list.json`);
  }
}

@ng.Injectable()
export class AnalyticsService implements service.AnalyticsService {
}

export {ActivityService} from '../services';


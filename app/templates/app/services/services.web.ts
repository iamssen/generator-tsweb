import * as ng from 'angular2/core';
import * as rx from 'rxjs';
import * as service from '../services';
import {Router} from 'angular2/router';
import {github, jsfiddle, Activity} from '../models';
import {GITHUB_USER_ID, JSFIDDLE_USER_ID} from '../consts';

function http<T>(req):rx.Observable<T> {
  return rx.Observable.fromPromise<T>($.getJSON(req) as Promise);
}

function jsonp<T>(url):rx.Observable<T> {
  return rx.Observable.create((subject:rx.Subject) => {
    $.ajax({
        url,
        dataType: 'jsonp',
        jsonp: 'callback'
      })
      .then(x => {
        subject.next(x.list);
        subject.complete();
      })
  })
}

function githubHttp<T>(url):rx.Observable<T> {
  return http<T>({
    url,
    beforeSend: req => req.setRequestHeader('Authorization', `token cd4981226b72e9bffd3f8796026aa6865c81cb73`)
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
    return jsonp(`http://jsfiddle.net/api/user/${JSFIDDLE_USER_ID}/demo/list.json`);
  }
}

@ng.Injectable()
export class AnalyticsService implements service.AnalyticsService {
  constructor(@ng.Inject(Router) private router:Router) {
    router.subscribe(path => {
      ga('send', 'preview', `/${path}`);
    });
  }
}

export {ActivityService} from '../services';
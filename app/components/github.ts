import * as ng from 'angular2/core';
import * as rx from 'rxjs';
import {github} from '../models';
import {GITHUB_SERVICE, GithubService} from '../services';

@ng.Component({
  selector: 'content-github',
  template: `
  <h1>Github Repositories</h1>
  <ul>
    <li *ngFor="#repository of repositories">
      <a href="{{repository.html_url}}" target="_blank">
        {{repository.name}}
      </a>
    </li>
  </ul>
  <h1>Github Gists</h1>
  <ul>
    <li *ngFor="#gist of gists">
      <a href="{{gist.html_url}}" target="_blank">
        {{gist.description}}
      </a>
    </li>
  </ul>
  `
})
export class Github implements ng.OnInit {
  private repositories:github.Repository[];
  private gists:github.Gist[];

  constructor(@ng.Inject(GITHUB_SERVICE) private githubService:GithubService) {
  }

  ngOnInit() {
    let subscription1 = this.githubService
      .repositories()
      .subscribe(
        x => this.repositories = x,
        e => console.log(e),
        () => subscription1.unsubscribe()
      );

    let subscription2 = this.githubService
      .gists()
      .subscribe(
        x => this.gists = x,
        e => console.log(e),
        () => subscription2.unsubscribe()
      );
  }
}
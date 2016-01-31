import * as ng from 'angular2/core';
import * as rx from 'rxjs';
import moment from 'moment';
import {Activity} from '../models';
import {ACTIVITY_SERVICE, ActivityService} from '../services';
import './activity.css!';

interface Link {
  name:string;
  url:string;
}

interface Item {
  name:string;
  date:string;
  preview:string;
  links:Link[];
}

@ng.Component({
  selector: 'content-activity',
  templateUrl: 'app/components/activity.html'
})
export class Activity implements ng.OnInit {
  private items:Item[];

  constructor(@ng.Inject(ACTIVITY_SERVICE) private activityService:ActivityService) {
  }

  ngOnInit() {
    let subscription = this.activityService
      .activities()
      .map((activities:Activity[]) => activities.sort((a, b) => (a.date > b.date) ? -1 : 1))
      .map((activities:Activity[]) => {
        return activities
          .sort((a, b) => (a.date > b.date) ? -1 : 1)
          .map(activity => {
            let name:string = activity.name;
            let date:string = moment(activity.date).format('MMM D, YYYY');
            let preview:string;
            let links:Link[] = [];

            switch (activity.from) {
              case 'github':
                preview = 'assets/github.svg';
                links.push({name: 'github', url: activity.github.html_url});
                break;
              case 'gist':
                preview = 'assets/gist.svg';
                links.push({name: 'gist', url: activity.gist.html_url});
                break;
              case 'jsfiddle':
                preview = 'assets/jsfiddle.svg';
                links.push({name: 'jsfiddle', url: activity.jsfiddle.url});
                break;
            }
            return {name, preview, links, date};
          })
      })
      .subscribe(
        x => this.items = x,
        e => console.log(e),
        () => subscription && subscription.unsubscribe()
      )
  }
}
System.register("app/consts.ts", [], function(exports_1) {
  var GITHUB_USER_ID,
      JSFIDDLE_USER_ID;
  return {
    setters: [],
    execute: function() {
      exports_1("GITHUB_USER_ID", GITHUB_USER_ID = 'iamssen');
      exports_1("JSFIDDLE_USER_ID", JSFIDDLE_USER_ID = 'iamssen');
    }
  };
});

System.register("app/services/services.web.ts", ["angular2/core", "rxjs", "../services", "../consts"], function(exports_1) {
  var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
  var __param = (this && this.__param) || function(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  };
  var ng,
      rx,
      service,
      consts_1;
  var GithubService,
      JsFiddleService,
      ActivityService;
  function http(req) {
    return rx.Observable.fromPromise($.getJSON(req));
  }
  function jsonp(url) {
    return rx.Observable.create(function(subject) {
      $.ajax({
        url: url,
        dataType: 'jsonp',
        jsonp: 'callback'
      }).then(function(x) {
        subject.next(x.list);
        subject.complete();
      });
    });
  }
  function githubHttp(url) {
    return http({
      url: url,
      beforeSend: function(req) {
        return req.setRequestHeader('Authorization', "token cd4981226b72e9bffd3f8796026aa6865c81cb73");
      }
    });
  }
  return {
    setters: [function(ng_1) {
      ng = ng_1;
    }, function(rx_1) {
      rx = rx_1;
    }, function(service_1) {
      service = service_1;
    }, function(consts_1_1) {
      consts_1 = consts_1_1;
    }],
    execute: function() {
      GithubService = (function() {
        function GithubService() {}
        GithubService.prototype.repositories = function() {
          return githubHttp("https://api.github.com/users/" + consts_1.GITHUB_USER_ID + "/repos");
        };
        GithubService.prototype.gists = function() {
          return githubHttp("https://api.github.com/users/" + consts_1.GITHUB_USER_ID + "/gists");
        };
        return GithubService;
      })();
      exports_1("GithubService", GithubService);
      JsFiddleService = (function() {
        function JsFiddleService() {}
        JsFiddleService.prototype.fiddles = function() {
          return jsonp("http://jsfiddle.net/api/user/" + consts_1.JSFIDDLE_USER_ID + "/demo/list.json");
        };
        return JsFiddleService;
      })();
      exports_1("JsFiddleService", JsFiddleService);
      ActivityService = (function() {
        function ActivityService(githubService, jsfiddleService) {
          this.githubService = githubService;
          this.jsfiddleService = jsfiddleService;
        }
        ActivityService.prototype.activities = function() {
          return rx.Observable.merge(this.githubService.repositories().map(function(repositories) {
            return repositories.map(function(repository) {
              return {
                name: repository.name,
                date: new Date(repository.updated_at),
                from: 'github',
                github: repository
              };
            });
          }), this.githubService.gists().map(function(gists) {
            return gists.map(function(gist) {
              return {
                name: gist.description,
                date: new Date(gist.updated_at),
                from: 'gist',
                gist: gist
              };
            });
          }), this.jsfiddleService.fiddles().map(function(fiddles) {
            return fiddles.map(function(fiddle) {
              return {
                name: fiddle.title,
                date: new Date(fiddle.created),
                from: 'jsfiddle',
                jsfiddle: fiddle
              };
            });
          }));
        };
        ActivityService = __decorate([__param(0, ng.Inject(service.GITHUB_SERVICE)), __param(1, ng.Inject(service.JSFIDDLE_SERVICE)), __metadata('design:paramtypes', [Object, Object])], ActivityService);
        return ActivityService;
      })();
      exports_1("ActivityService", ActivityService);
    }
  };
});

System.register("contexts.web/main.ts", ["angular2/core", "angular2-reflow", "../app/services", "../app/services/services.web"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ng,
      rf,
      services_1,
      services_web_1;
  var ContextFactory;
  return {
    setters: [function(ng_1) {
      ng = ng_1;
    }, function(rf_1) {
      rf = rf_1;
    }, function(services_1_1) {
      services_1 = services_1_1;
    }, function(services_web_1_1) {
      services_web_1 = services_web_1_1;
    }],
    execute: function() {
      ContextFactory = (function(_super) {
        __extends(ContextFactory, _super);
        function ContextFactory() {
          _super.apply(this, arguments);
        }
        ContextFactory.prototype.mapDependency = function() {
          this.provide(new ng.Provider(services_1.GITHUB_SERVICE, {useClass: services_web_1.GithubService}));
          this.provide(new ng.Provider(services_1.JSFIDDLE_SERVICE, {useClass: services_web_1.JsFiddleService}));
          this.provide(new ng.Provider(services_1.ACTIVITY_SERVICE, {useClass: services_web_1.ActivityService}));
        };
        return ContextFactory;
      })(rf.ContextFactory);
      exports_1("ContextFactory", ContextFactory);
    }
  };
});

System.register("app/components/github.ts", ["angular2/core", "../services"], function(exports_1) {
  var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
  var __param = (this && this.__param) || function(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  };
  var ng,
      services_1;
  var Github;
  return {
    setters: [function(ng_1) {
      ng = ng_1;
    }, function(services_1_1) {
      services_1 = services_1_1;
    }],
    execute: function() {
      Github = (function() {
        function Github(githubService) {
          this.githubService = githubService;
        }
        Github.prototype.ngOnInit = function() {
          var _this = this;
          var subscription1 = this.githubService.repositories().subscribe(function(x) {
            return _this.repositories = x;
          }, function(e) {
            return console.log(e);
          }, function() {
            return subscription1.unsubscribe();
          });
          var subscription2 = this.githubService.gists().subscribe(function(x) {
            return _this.gists = x;
          }, function(e) {
            return console.log(e);
          }, function() {
            return subscription2.unsubscribe();
          });
        };
        Github = __decorate([ng.Component({
          selector: 'content-github',
          template: "\n  <h1>Github Repositories</h1>\n  <ul>\n    <li *ngFor=\"#repository of repositories\">\n      <a href=\"{{repository.html_url}}\" target=\"_blank\">\n        {{repository.name}}\n      </a>\n    </li>\n  </ul>\n  <h1>Github Gists</h1>\n  <ul>\n    <li *ngFor=\"#gist of gists\">\n      <a href=\"{{gist.html_url}}\" target=\"_blank\">\n        {{gist.description}}\n      </a>\n    </li>\n  </ul>\n  "
        }), __param(0, ng.Inject(services_1.GITHUB_SERVICE)), __metadata('design:paramtypes', [(typeof(_a = typeof services_1.GithubService !== 'undefined' && services_1.GithubService) === 'function' && _a) || Object])], Github);
        return Github;
        var _a;
      })();
      exports_1("Github", Github);
    }
  };
});

System.register("app/components/jsfiddle.ts", ["angular2/core", "../services"], function(exports_1) {
  var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
  var __param = (this && this.__param) || function(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  };
  var ng,
      services_1;
  var JsFiddle;
  return {
    setters: [function(ng_1) {
      ng = ng_1;
    }, function(services_1_1) {
      services_1 = services_1_1;
    }],
    execute: function() {
      JsFiddle = (function() {
        function JsFiddle(jsfiddleService) {
          this.jsfiddleService = jsfiddleService;
        }
        JsFiddle.prototype.ngOnInit = function() {
          var _this = this;
          var subscription = this.jsfiddleService.fiddles().subscribe(function(x) {
            return _this.fiddles = x;
          }, function(e) {
            return console.log(e);
          }, function() {
            return subscription.unsubscribe();
          });
        };
        JsFiddle = __decorate([ng.Component({
          selector: 'content-jsfiddle',
          template: "\n  <h1>Js Fiddle</h1>\n  <ul>\n    <li *ngFor=\"#fiddle of fiddles\">\n      <a href=\"{{fiddle.url}}\" target=\"_blank\">\n        {{fiddle.title}}\n      </a>\n    </li>\n  </ul>\n  "
        }), __param(0, ng.Inject(services_1.JSFIDDLE_SERVICE)), __metadata('design:paramtypes', [(typeof(_a = typeof services_1.JsFiddleService !== 'undefined' && services_1.JsFiddleService) === 'function' && _a) || Object])], JsFiddle);
        return JsFiddle;
        var _a;
      })();
      exports_1("JsFiddle", JsFiddle);
    }
  };
});

System.register("app/services.ts", [], function(exports_1) {
  var GITHUB_SERVICE,
      JSFIDDLE_SERVICE,
      ACTIVITY_SERVICE;
  return {
    setters: [],
    execute: function() {
      exports_1("GITHUB_SERVICE", GITHUB_SERVICE = 'githubService');
      exports_1("JSFIDDLE_SERVICE", JSFIDDLE_SERVICE = 'jsfiddleService');
      exports_1("ACTIVITY_SERVICE", ACTIVITY_SERVICE = 'activityService');
    }
  };
});

System.register("app/components/activity.css!github:systemjs/plugin-css@0.1.20", [], function() { return { setters: [], execute: function() {} } });

System.register("app/components/activity.ts", ["angular2/core", "moment", "../services", "./activity.css!"], function(exports_1) {
  var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
  var __param = (this && this.__param) || function(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  };
  var ng,
      moment_1,
      services_1;
  var Activity;
  return {
    setters: [function(ng_1) {
      ng = ng_1;
    }, function(moment_1_1) {
      moment_1 = moment_1_1;
    }, function(services_1_1) {
      services_1 = services_1_1;
    }, function(_1) {}],
    execute: function() {
      Activity = (function() {
        function Activity(activityService) {
          this.activityService = activityService;
        }
        Activity.prototype.ngOnInit = function() {
          var _this = this;
          var subscription = this.activityService.activities().concatAll().bufferCount(100, 100).map(function(activities) {
            return activities.sort(function(a, b) {
              return (a.date > b.date) ? -1 : 1;
            });
          }).map(function(activities) {
            return activities.sort(function(a, b) {
              return (a.date > b.date) ? -1 : 1;
            }).map(function(activity) {
              var name = activity.name;
              var date = moment_1.default(activity.date).format('MMM D, YYYY');
              var preview;
              var links = [];
              switch (activity.from) {
                case 'github':
                  preview = 'assets/github.svg';
                  links.push({
                    name: 'github',
                    url: activity.github.html_url
                  });
                  break;
                case 'gist':
                  preview = 'assets/gist.svg';
                  links.push({
                    name: 'gist',
                    url: activity.gist.html_url
                  });
                  break;
                case 'jsfiddle':
                  preview = 'assets/jsfiddle.svg';
                  links.push({
                    name: 'jsfiddle',
                    url: activity.jsfiddle.url
                  });
                  break;
              }
              return {
                name: name,
                preview: preview,
                links: links,
                date: date
              };
            });
          }).subscribe(function(x) {
            return _this.items = x;
          }, function(e) {
            return console.log(e);
          }, function() {
            return subscription.unsubscribe();
          });
        };
        Activity = __decorate([ng.Component({
          selector: 'content-jsfiddle',
          templateUrl: 'app/components/activity.html'
        }), __param(0, ng.Inject(services_1.ACTIVITY_SERVICE)), __metadata('design:paramtypes', [(typeof(_a = typeof services_1.ActivityService !== 'undefined' && services_1.ActivityService) === 'function' && _a) || Object])], Activity);
        return Activity;
        var _a;
      })();
      exports_1("Activity", Activity);
    }
  };
});

System.register("app/components/main.css!github:systemjs/plugin-css@0.1.20", [], function() { return { setters: [], execute: function() {} } });

System.register("app/components/main.ts", ["angular2/core", "angular2/router", "angular2-reflow", "contexts:main", "./github", "./jsfiddle", "./activity", "./main.css!"], function(exports_1) {
  var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
  var __param = (this && this.__param) || function(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  };
  var ng,
      router,
      Rf,
      contexts_main_1,
      github_1,
      jsfiddle_1,
      activity_1;
  var context,
      routeConfig,
      Main;
  return {
    setters: [function(ng_1) {
      ng = ng_1;
    }, function(router_1) {
      router = router_1;
    }, function(Rf_1) {
      Rf = Rf_1;
    }, function(contexts_main_1_1) {
      contexts_main_1 = contexts_main_1_1;
    }, function(github_1_1) {
      github_1 = github_1_1;
    }, function(jsfiddle_1_1) {
      jsfiddle_1 = jsfiddle_1_1;
    }, function(activity_1_1) {
      activity_1 = activity_1_1;
    }, function(_1) {}],
    execute: function() {
      context = new contexts_main_1.ContextFactory;
      routeConfig = [{
        path: '/',
        name: 'Activities',
        component: activity_1.Activity
      }, {
        path: '/github',
        name: 'Github',
        component: github_1.Github
      }, {
        path: '/jsfiddle',
        name: 'JS Fiddle',
        component: jsfiddle_1.JsFiddle
      }];
      Main = (function() {
        function Main(location, context) {
          this.location = location;
          this.context = context;
          this.routeConfig = routeConfig;
        }
        Main.prototype.ngOnInit = function() {
          this.context.start();
        };
        Main.prototype.ngOnDestroy = function() {
          this.context.destroy();
        };
        Main.prototype.isActive = function(path) {
          if (this.location.path() === '' && path === '/')
            return true;
          return this.location.path() === path;
        };
        Main = __decorate([ng.Component({
          selector: 'app-main',
          providers: [context.providers, router.ROUTER_PROVIDERS, ng.provide(router.LocationStrategy, {useClass: router.HashLocationStrategy})],
          templateUrl: 'app/components/main.html',
          directives: [router.ROUTER_DIRECTIVES]
        }), router.RouteConfig(routeConfig), __param(0, ng.Inject(router.Location)), __param(1, ng.Inject(Rf.CONTEXT)), __metadata('design:paramtypes', [Object, Object])], Main);
        return Main;
      })();
      exports_1("Main", Main);
    }
  };
});

System.register("app/boot.ts", ["angular2/platform/browser", "./components/main"], function(exports_1) {
  var browser_1,
      main_1;
  return {
    setters: [function(browser_1_1) {
      browser_1 = browser_1_1;
    }, function(main_1_1) {
      main_1 = main_1_1;
    }],
    execute: function() {
      browser_1.bootstrap(main_1.Main);
    }
  };
});

System.register('app/components/activity.css!github:systemjs/plugin-css@0.1.20', [], false, function() {});
System.register('app/components/main.css!github:systemjs/plugin-css@0.1.20', [], false, function() {});
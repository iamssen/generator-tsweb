export interface Activity {
  name:string;
  date:Date;
  from:string;
  github?:github.Repository;
  gist?:github.Gist;
  jsfiddle?:jsfiddle.Fiddle;
}

export module github {
  export interface Gist {
    id: string;
    description: string;
    html_url: string;
    url:string;
    created_at:string;
    updated_at:string;
  }

  export interface Repository {
    id: number;
    name:string;
    owner:{login:string};
    full_name:string;
    html_url:string;
    description:string;
    created_at:string;
    updated_at:string;
    pushed_at:string;
    git_url: string;
    open_issues:number;
    default_branch:string;
  }
}

export module jsfiddle {
  export interface Fiddle {
    framework:string;
    title:string;
    url:string;
    created:string;
  }
}
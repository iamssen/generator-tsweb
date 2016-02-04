# Yeoman Generator for Web Application

```sh
npm install -g generator-tsweb
mkdir your-project
cd your-project
yo tsweb
```

# Generated Files Preview

<http://iamssen.github.io/generator-tsweb> [Source Code](https://github.com/iamssen/generator-tsweb/tree/gh-pages)

# Update log

## 2016.2.5
- Add Google Analytics
- Now `npm run serve` command using system environment variable `$BROWSER`
  - If did you not setting that env than open with system default browser
  - Else open with the specific browser
  - Write `export BROWSER="/Applications/Google Chrome Canary.app";` to your environment variable config files

## 2016.2.4
- Angular2 polyfills move from `<script/>` to `boot.js`

## 2016.2.1
- Redesign all

## 2016.1.25
- Add electron build
- Add `angular2-reflow`
- Redesign all

## 2015.12.31
- `[routerLink]` with `*ngFor`
- Add `main.scss`
- Remove `use strict`

## 2015.12.21
- Excluded ignore `/dist`
- Separated `modules.json`

## 2015.12.20
- Source code improved

## 2015.12.18
- First release
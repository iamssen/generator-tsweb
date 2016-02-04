/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="./d.ts"/>
import 'es6-shim';
import 'es6-promise';
import 'zone.js/lib/browser/zone-microtask';
import 'reflect-metadata';

declare class Error {
  static stackTraceLimit:number;
}
Error.stackTraceLimit = Infinity;

import {bootstrap} from 'angular2/platform/browser';
import {Main} from './components/main';
bootstrap(Main);
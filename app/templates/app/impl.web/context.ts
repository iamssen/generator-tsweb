import {Provider, Inject} from 'angular2/core';
import * as reflow from 'angular2-reflow';
import * as service from '../app/service/service';

class Service implements service.Service {
  hello():Promise<string> {
    return new Promise(function (resolve, reject) {
      setTimeout(() => resolve('web service'), 1000);
    });
  }
}

class Command1 implements reflow.Command {
  constructor(@Inject('service') private service:service.Service) {
  }

  execute(chain:reflow.CommandChain) {
    setTimeout(() => {
      console.log('web command1 executed', this.service);
      chain.next();
    }, 1000);
  }

  stop() {
  }
}

class Command2 implements reflow.Command {
  constructor(@Inject('service') private service:service.Service) {
  }

  execute(chain:reflow.CommandChain) {
    setTimeout(() => {
      console.log('web command2 executed', this.service);
      chain.next();
    }, 1000);
  }

  stop() {
  }
}

class Command3 implements reflow.Command {
  constructor(@Inject('service') private service:service.Service) {
  }

  execute(chain:reflow.CommandChain) {
    setTimeout(() => {
      console.log('web command3 executed', this.service);
      chain.next();
    }, 1000);
  }

  stop() {
  }
}

export class ContextFactory extends reflow.ContextFactory {
  mapDependency() {
    this.provide(new Provider('service', {useClass: Service}));
    this.mapCommand('execute-commands', [Command1, Command2, Command3]);
  }
}
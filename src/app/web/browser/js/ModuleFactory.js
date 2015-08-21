import ApiStorage from 'piggy-module/lib/Storage/Api';
import SourceService from './modules/source/Service';
import SourceManager from './modules/source/Manager';
import UserService from './modules/user/Service';
import UserManager from './modules/user/Manager';

let moduleClasses = {
  'services': {
    'source': SourceService,
    'user': UserService
  },
  'managers': {
    'source' : SourceManager,
    'user' : UserManager
  },
};

export default class ModuleFactory {
  static serviceExists(module) {
    return Object.keys(ModuleFactory._classes.services).indexOf(module) > -1;
  }

  static getServiceInstance(module, context={}) {
    let Service = ModuleFactory.getServiceClass(module);
    return ModuleFactory.getManagerInstance(module)
      .then( manager => {
        let s = new Service(manager);
        s.setFullContext(context);
        return s;
      });
  }

  static getServiceClass(module) {
    if (!ModuleFactory.serviceExists(module)) {
      throw new Error('Unable to get service module class ' + module);
    }
    return ModuleFactory._classes.services[module];
  }

  static managerExists(module) {
    return Object.keys(ModuleFactory._classes.managers).indexOf(module) > -1;
  }

  static getManagerInstance(module) {
    let Manager = ModuleFactory.getManagerClass(module);
    return ModuleFactory.getStorage(module)
      .then( storage => {
        return new Manager(storage);
      });
  }

  static getManagerClass(module) {
    if (!ModuleFactory.managerExists(module)) {
      throw new Error('Unable to get manager module class ' + module);
    }
    return ModuleFactory._classes.managers[module];
  }

  static getStorage(module) {
    let collection = 'http://pickpic.com:2223/' + module + '/';
    return new Promise( (resolve, reject) => {
      return resolve(new ApiStorage(collection));
    });
  }
}

Object.defineProperty(ModuleFactory, '_classes', {
  'enumerable': false,
  'writable': false,
  'configurable': false,
  'value': moduleClasses,
});
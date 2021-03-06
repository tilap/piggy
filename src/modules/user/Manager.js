import Manager from 'piggy-module/lib/Manager';
import ManagerError from 'piggy-module/lib/Errors';
import ItemVo from './Vo';
import ItemValidator from './Validator';

export default class UserManager extends Manager {

  constructor(storage) {
    super(storage);
  }

  getByStrategyToken(strategy, strategyId) {
    let criteria = {};
    criteria['_auths.' + strategy + '.id'] = strategyId;

    return new Promise( (resolve) => {
      this.get(criteria).then( users => {
        switch (users.length) {
          case 0:
            return resolve(null);
          case 1:
            return resolve(users[0]);
          default:
            throw new ManagerError('Multiple results for getByStrategyToken method');
        }
      });
    });
  }


}

Manager.init(UserManager, ItemVo, ItemValidator);

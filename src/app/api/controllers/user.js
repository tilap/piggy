import ModuleFactory from 'library/ModuleFactory';
let userService = ModuleFactory.getService('user');

module.exports.get = function *() {
  this.bag.setMultipleRessourceResponse();
  let items = yield userService.getByPage();
  this.bag.setDataFromVos(items);
  return this.renderBag();
};


module.exports.getOneByUsername = function *() {
  this.bag.setSingleRessourceResponse();
  let username = this.params.username || '';
  let item = yield userService.getOneByUsername(username);
  if(!item) {
    this.throw(404);
  }
  this.bag.setDataFromVo(item);
  return this.renderBag();
};


module.exports.getOneById = function *() {
  this.bag.setSingleRessourceResponse();
  let id = this.params.id || '';
  let item = yield userService.getOneById(id);
  if(!item) {
    this.throw(404);
  }
  this.bag.setDataFromVo(item);
  return this.renderBag();
};


module.exports.createOne = function *(next) {
  this.bag.setSingleRessourceResponse();
  let itemData = this.utils.getFromPost(['username', 'firstname', 'lastname', 'email']);
  try {
    let newVo = yield userService.createOneFromData(itemData, 'api');
    this.bag.setDataFromVo(newVo);
    this.renderBag();
  }
  catch(errors) {
    if(errors instanceof Error) {
      throw errors;
    }
    this.bag.addError(errors);
    return this.renderBag();
  }
};


module.exports.updateOneById = function *() {
  this.bag.setSingleRessourceResponse();

  let id = this.params.id || '';
  let itemData = this.utils.getFromPost(['username', 'firstname', 'lastname', 'email']);

  let item = yield userService.getOneById(id);
  if(!item) {
    this.throw(404);
  }

  try {
    let updatedVo = yield userService.updateOneFromData(itemData, item.id);
    this.bag.setDataFromVo(updatedVo);
    return this.renderBag();
  }
  catch(errors) {
    if(errors instanceof Error) {
      throw errors;
    }
    this.bag.addError(errors);
    return this.renderBag();
  }
};

module.exports.deleteOneById = function *() {
  this.bag.setRawResponse();

  let id = this.params.id || '';
  let item = yield userService.getOneById(id);
  if(!item) {
    this.throw(404);
  }

  let successDeleted = yield userService.deleteOneById(item.id);
  this.bag.setData({deleted: true===successDeleted ? 1: 0});
  return this.renderBag();
}

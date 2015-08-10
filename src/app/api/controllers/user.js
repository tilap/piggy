module.exports.get = function *() {
  let userService = yield this.getModuleService('user');
  this.bag.setMultipleRessourceResponse();

  let options = this.utils.getFromQueryM(['page', 'limit', 'orderby', 'order'], null, true);
  let page = options.page && options.page.match(/^\d+$/) && options.page > 0 ? options.page : 1;
  let limit = options.limite && options.limit.match(/^\d+$/) && options.limit > 0 && options.limit < 1000 ? options.limit : 25;
  let orderby = options.orderby && ['username', 'firstname', 'lastname', 'email'].indexOf(options.orderby) > -1 ? options.orderby : 'username';
  let order = options.order && options.order==='desc' ? 'desc': 'asc';
  let items = yield userService.getByPage({}, page, limit, orderby, order);
  this.bag.setDataFromVos(items);
  return this.renderBag();
};


module.exports.getOneById = function *() {
  let userService = yield this.getModuleService('user');

  this.bag.setSingleRessourceResponse();
  let id = this.params.id || '';
  let item = yield userService.getOneById(id);
  this.assert(item, 404, 'item not found');
  this.bag.setDataFromVo(item);
  return this.renderBag();
};


module.exports.getOneByUsername = function *() {
  let userService = yield this.getModuleService('user');

  this.bag.setSingleRessourceResponse();
  let username = this.params.username || '';
  let item = yield userService.getOneByUsername(username);
  this.assert(item, 404, 'item not found');
  this.bag.setDataFromVo(item);
  return this.renderBag();
};


module.exports.createOne = function *(next) {
  let userService = yield this.getModuleService('user');

  this.bag.setSingleRessourceResponse();
  let itemData = this.utils.getFromPostM(['username', 'firstname', 'lastname', 'email']);
  try {
    let newVo = yield userService.createNewOne(itemData, 'api');
    this.bag.setDataFromVo(newVo);
    this.renderBag();
  } catch(errors) {
    if (errors instanceof Error) {
      throw errors;
    }
    this.bag.addError(errors);
    return this.renderBag();
  }
};


module.exports.updateOneById = function *() {
  let userService = yield this.getModuleService('user');

  this.bag.setSingleRessourceResponse();
  let id = this.params.id || '';
  let item = yield userService.getOneById(id);
  this.assert(item, 404, 'item not found');

  let itemData = this.utils.getFromPostM(['firstname', 'lastname', 'email'], null, true);
  try {
    let updatedVo = yield userService.updateOneFromData(itemData, item.id);
    this.bag.setDataFromVo(updatedVo);
    return this.renderBag();
  } catch(errors) {
    if (errors instanceof Error) {
      throw errors;
    }
    this.bag.addError(errors);
    return this.renderBag();
  }
};

module.exports.deleteOneById = function *() {
  let userService = yield this.getModuleService('user');

  this.bag.setRawResponse();

  let id = this.params.id || '';
  let item = yield userService.getOneById(id);
  this.assert(item, 404, 'item not found');

  let successDeleted = yield userService.deleteOneById(item.id);
  this.bag.setData({'deleted': successDeleted === true ? 1 : 0});
  return this.renderBag();
};

import Storage from 'piggy-module/lib/Storage/Db';

export default class UserStorage extends Storage {
  constructor(collection, name) {
    super(collection, name);
  }
}

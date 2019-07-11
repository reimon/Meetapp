import Sequelize from 'sequelize';

import User from '../app/models/User';
import configDatabase from '../config/database';
import File from '../app/models/File';
import Meetups from '../app/models/Meetups';

const models = [User, File, Meetups];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(configDatabase);
    // executa uma função em cada elemento do array models =[User]
    //
    models.forEach(model => model.init(this.connection));
  }
}

export default new Database();

import Sequelize from 'sequelize';

import User from '../app/models/User';
import configDatabase from '../config/database';
import File from '../app/models/File';
import Meetups from '../app/models/Meetups';
import Subscription from '../app/models/Subscription';

const models = [User, File, Meetups, Subscription];

class Database {
  constructor() {
    this.init();
    this.associate();
  }

  init() {
    this.connection = new Sequelize(configDatabase);
    // executa uma função em cada elemento do array models =[User ...]
    //
    models.forEach(model => model.init(this.connection));
  }

  // FAZ A ASSOCIAÇÃO ENTRE AS TABELAS
  associate() {
    models.forEach(model => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });
  }
}

export default new Database();

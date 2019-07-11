import Sequelize, { Model } from 'sequelize';
import { isBefore } from 'date-fns';

class Meetups extends Model {
  static init(sequelize) {
    super.init(
      {
        titulo: Sequelize.STRING,
        descricao: Sequelize.STRING,
        localizacao: Sequelize.STRING,
        data: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'file_id' });
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}
export default Meetups;

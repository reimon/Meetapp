// será acessado tando pelo sequelize linha de comando quanto pelo sistema
module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'meetapp',
  define: {
    // garante a criação de duas colunas uma com data de crição
    // e outra com data de alteração dos dados
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

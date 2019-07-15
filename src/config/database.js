// será acessado tando pelo sequelize linha de comando quanto pelo sistema
module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    // garante a criação de duas colunas uma com data de crição
    // e outra com data de alteração dos dados
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

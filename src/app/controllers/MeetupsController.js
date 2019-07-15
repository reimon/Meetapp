import * as Yup from 'yup';
import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetups';
import User from '../models/User';
import File from '../models/File';

class MeetupsController {
  // CADASTRAR MEETUP
  async store(req, res) {
    // VALIDAÇÃO DO FORMULÁRIO
    const schema = Yup.object().shape({
      titulo: Yup.string().required(),
      descricao: Yup.string().required(),
      localizacao: Yup.string().required(),
      banner_id: Yup.number().required(),
      // .min(new Date()) VERIFICAR SE O MEETUP NÃO ESTÁ COM DATA PASSADA
      data: Yup.date()
        .min(new Date())
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação do formulário falhou' });
    }
    // FIM DA VALIDAÇÃO DOS CAMPOS

    const { titulo, descricao, localizacao, data, banner_id } = req.body;

    // BUSCA OS DADOS DO USUÁRIO A PARTIR DO ID DISPONIVEL NO req.userId
    // CRIADA NO ARQUIVO SessionController.js
    const user_id = req.userId;

    // GRAVAR AS INFORMAÇÕES NO BANCO DE DADOS
    const meetups = await Meetup.create({
      titulo,
      descricao,
      localizacao,
      data,
      banner_id,
      user_id,
    });

    return res.json(meetups);
  }
  // FIM CADASTRO MEETUP

  // ATUALIZAÇÃO DO CADASTRO
  async update(req, res) {
    const schema = Yup.object().shape({
      titulo: Yup.string(),
      descricao: Yup.string(),
      localizacao: Yup.string(),
      banner_id: Yup.number(),
      // .min(new Date()) VERIFICAR SE O MEETUP NÃO ESTÁ COM DATA PASSADA
      data: Yup.date().min(new Date()),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação do formulário falhou' });
    }

    // ID DO USUÁRIO LOGADO
    const user_id = req.userId;

    // const meetup = await Meetup.findAll({ where: { user_id: req.params.id } });
    // const { params_id: user_id } = await User.findByPk(req.params.id);

    // ARMAZANA TODOS OS DADOS NO DO MEETUP NA CONST 'meetup'
    const meetup = await Meetup.findByPk(req.params.id);
    // SE O ID DO USUÁRIO LOGADO FOR DIVERENTE DO ID DO USUÁRIO QUE CRIOU O MEETUP
    // O SISTEMA RETORNA ERRO
    if (user_id !== meetup.user_id) {
      return res.status(400).json({ erro: 'Não autorizado' });
    }

    // ANALISA SE A DATA JÁ PASSOU
    if (meetup.past) {
      return res.status(400).json({ erro: 'Data do Meetup já passou' });
    }
    await meetup.update(req.body);
    return res.json(meetup);
  }
  // FIM DA ATUALIZAÇÃO

  // DELETA OS MEETUPS DO USUÁRIO LOGADO
  async delete(req, res) {
    const user_id = req.userId;
    const meetup = await Meetup.findByPk(req.params.id);
    if (meetup.user_id !== user_id) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    if (meetup.past) {
      return res
        .status(400)
        .json({ error: 'Não é possível excluir os meetups anteriores.' });
    }

    await meetup.destroy();

    return res.send();
  }
  // FIM DELETE

  // LISTA OS MEETUPS DO USUÁRIO LOGADO
  async index(req, res) {
    const { page = 1 } = req.query;

    if (!req.query.date) {
      return res.status(400).json({ error: 'Data Inválida' });
    }
    const searchDate = parseISO(req.query.date);

    const meetups = await Meetup.findAll({
      where: {
        user_id: req.userId,
        data: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
      order: [['data', 'DESC']],
      limit: 10,
      offset: (page - 1) * 10,
      attributes: [
        'id',
        'titulo',
        'descricao',
        'localizacao',
        'user_id',
        'banner_id',
        'data',
      ],
      include: [
        {
          model: File,
          attributes: ['path'],
        },
        {
          model: User,
          attributes: ['name', 'email', 'avatar_id'],
        },
      ],
    });

    return res.json(meetups);
  }

  // FIM LISTA
}
export default new MeetupsController();

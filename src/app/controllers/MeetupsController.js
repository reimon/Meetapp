import * as Yup from 'yup';
// import { isBefore, startOfDay, endOfDay, parseISO } from 'date-fns';
import Meetup from '../models/Meetups';
import User from '../models/User';

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

    // eslint-disable-next-line no-console
    console.log({
      titulo,
      descricao,
      localizacao,
      data,
      banner_id,
      user_id,
    });

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
  async update(req, res) {
    return res.json({ ok: true });
  }
}
export default new MeetupsController();

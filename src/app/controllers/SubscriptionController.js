import { Op } from 'sequelize';

import User from '../models/User';
import Meetup from '../models/Meetups';
import Subscription from '../models/Subscription';
import SubscriptionMail from '../jobs/SubscriptionMail';
import Queue from '../../lib/Queue';

class SubscriptionController {
  // CADASTRA USUÁRIO LOGADO EM UM MEETUPS
  async store(req, res) {
    // BUSCA OS DADOS DO USUÁRIO LOGADO
    // const user = await User.findByPk(req.userId);
    // console.log(user);

    // BUSCA OS DADOS DO MEETUP SELECIONADO, JUNTO COM OS DADOS
    // DO USUÁRIO QUE CADASTRO
    const meetup = await Meetup.findByPk(req.params.id, {
      include: [User],
    });
    // VERIFICA SE O CRIADOR DO MEETUP ESTÁ TENTANDO SE CADASTRAR NO MESMO
    if (meetup.user_id === req.userId) {
      return res.status(400).json({
        error: 'Não é possível se inscrever em seus próprios meetups',
      });
    }
    // VERIFICA SE O MEETUP JÁ PASSOU
    if (meetup.past) {
      return res
        .status(400)
        .json({ error: 'Não é possível se inscrever nesse meetups' });
    }

    // VERIFICA SE O USUÁRIO JÁ NÃO ESTÁ CADASTRADO EM OUTRO NA MESMA DATA
    const check = await Subscription.findOne({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            data: meetup.data,
          },
        },
      ],
    });

    if (check) {
      return res
        .status(400)
        .json({ error: 'Já existe uma incrição sua nessa data' });
    }
    // ENVIA OS DADOS PARA A TABELA Subscription NO BANCO DE DADOS
    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    });

    const user = await User.findByPk(req.userId);

    await Queue.add(SubscriptionMail.key, {
      meetup,
      user,
    });

    return res.json(subscription);
  }
  // FIM CADASTRO DE MEETUPS

  // LISTAR INSCRIÇÕES NO MEETUPS
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          where: {
            data: {
              [Op.gt]: new Date(),
            },
          },
          required: true,
        },
      ],
      order: [[Meetup, 'data']],
    });

    return res.json(subscriptions);
  }
  // FIM DA LISTAGEM
}
export default new SubscriptionController();

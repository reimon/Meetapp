import File from '../models/File';
import User from '../models/User';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    // BUSCA OS DADOS DO USUÁRIO A PARTIR DO ID DISPONIVEL NO req.userId
    // CRIADA NO ARQUIVO SessionController.js
    const { id: idUser, name: nameUser, email } = await User.findByPk(
      req.userId
    );

    const { id, url } = file;
    return res.json({ id, url, name, path, idUser, nameUser, email });
  }
}

export default new FileController();

// Arquivo de configuração de upload de arquivo
// Ele ira export um objeto de configuração que será usado no momento do
// upload do arquivo

// multer para manimulação do multipart/form-data
import multer from 'multer';

// crypto bibliotera padrão que vem node utilizada para
// gerar caracteries aleatórios, que será usado
// para criar um nome único para o arquivo
import crypto from 'crypto';

// função 'extname' - para extrair a extenção do arquivo
// função 'resolve' - para percorrer um caminha dentro da aplicação
// independente do sistema operacional ou dispositivo.
import { extname, resolve } from 'path';

export default {
  // storage - local onde o multer irar armazenar o arquivo
  storage: multer.diskStorage({
    // destino onde será armazenado o arquivo
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // como iremos formatar o nome do arquivo
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};

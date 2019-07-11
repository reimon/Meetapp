import { Router } from 'express';

import multer from 'multer';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import auth from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import MeetupsController from './app/controllers/MeetupsController';
// CONFIGURAÇÃO DO UPLOAD DE ARQUIVO
import multerConfig from './config/multer';

// MIDDLEWARE DE UPLOAD
const upload = multer(multerConfig);
const routes = new Router();

// CRIAÇÃO DO USUÁRIO
routes.post('/users', UserController.store);

// AUTENTICAÇÃO DO USUÁRIO
routes.post('/sessions', SessionController.store);

// MIDDLEWARE GLOBAL DE VERIFICAÇÃO DE AUTENTICAÇÃO DO USUÁRIO
// TODAS AS ROTAS ABAIXO SERÃO VERIFICADAS SE O TOKEN DO USUÁRIO É VALIDO
routes.use('/', auth);

// ROTA PARA ENVIAR ARQUIVO
routes.post('/files', upload.single('file'), FileController.store);

// ROTA PARA CADASTRO DO MEETUP
routes.post('/meetups', MeetupsController.store);

// ATUALIZAÇÃO DOS DADOS DO USUÁRIO
routes.put('/users', UserController.update);
export default routes;

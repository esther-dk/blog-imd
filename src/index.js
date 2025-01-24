// Importa o módulo Express, uma biblioteca para criação de servidores web
const express = require('express');

// Importa as rotas relacionadas a usuários
const rotaUsuario = require('./rotas/usuario.rota');

// Importa as rotas relacionadas a posts
const rotaPost = require('./rotas/posts.rota');

// Importa o middleware express-ejs-layouts, usado para trabalhar com layouts no EJS
var expressLayouts = require('express-ejs-layouts');

// Importa as rotas relacionadas à página inicial
const indexRoute = require('./rotas/index.rota');

// Importa o logger personalizado para registrar mensagens
const logger = require('./utils/logger');

// Importa o middleware de log, que registra informações sobre cada requisição
const logMiddleware = require('./middleware/log.mid');

// Importa o módulo JSON Web Token (JWT), usado para autenticação
const jwt = require("jsonwebtoken");

// Carrega variáveis de ambiente do arquivo .env
require('dotenv').config();

// Cria a aplicação Express
const app = express();

// Configura o middleware para interpretar requisições com JSON no corpo
app.use(express.json());

// Configura o motor de visualização como EJS
app.set('view engine', 'ejs');

// Configura o middleware de log personalizado, que registra detalhes das requisições
app.use(logMiddleware);

// Define o layout padrão a ser usado nas páginas renderizadas
app.set('layout', 'layouts/layout');

// Ativa o middleware express-ejs-layouts para lidar com layouts no EJS
app.use(expressLayouts);

// Configura uma rota estática para servir arquivos da pasta 'public' em '/static'
app.use('/static', express.static('public'));

// Usa as rotas definidas no arquivo 'index.rota' para a URL raiz '/'
app.use('/', indexRoute);

// Usa as rotas definidas no arquivo 'usuario.rota' para as URLs que começam com '/api/usuarios'
app.use('/api/usuarios', rotaUsuario);

// Usa as rotas definidas no arquivo 'posts.rota' para as URLs que começam com '/api/posts'
app.use('/api/posts', rotaPost);

// Define uma rota simples para '/api' que retorna uma mensagem em formato JSON
app.get('/api', (req, res) => {
    res.json({ msg: "Hello from Express!" });
});

// Middleware de tratamento de erros
// Recebe erros e retorna uma resposta personalizada com o código de status e mensagem
app.use((err, req, res, next) => {
    const { statusCode, msg } = err; // Extrai o código de status e a mensagem do erro
    res.status(statusCode).json({ msg: msg }); // Retorna o erro no formato JSON
});

// Inicia o servidor na porta 8080
app.listen(8080, () => {
    // Registra uma mensagem de inicialização no logger, incluindo o ambiente de execução
    logger.info(`Iniciando no ambiente ${process.env.NODE_ENV}`);
    logger.info('Servidor pronto na porta 8080');
});

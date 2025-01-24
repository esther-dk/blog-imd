// Importa o framework Express, utilizado para criar e gerenciar as rotas da aplicação.
const express = require('express');

// Cria um objeto `Router` para organizar as rotas relacionadas aos posts.
const router = express.Router();

// Importa um middleware que valida as propriedades de um post.
const postMid = require('../middleware/validarPost.middleware');

// Importa os modelos `Post` e `Usuario` para interagir com o banco de dados.
const { Post, Usuario } = require('../db/models');

// Importa o módulo Multer, que facilita o upload de arquivos no Node.js.
var multer = require('multer');

// Importa o módulo `path`, que permite manipular caminhos de arquivos e extensões.
const path = require('path');

// Importa um manipulador de erros personalizado.
const ErrorHandler = require('../utils/ErrorHandler');

// Importa middleware de autenticação para proteger rotas.
const autenticar = require('../middleware/autenticacao.mid');

// ========================== Configuração do Multer ========================== //

// Configura o armazenamento dos arquivos enviados.
var storage = multer.diskStorage({
    // Define o diretório onde os arquivos serão salvos.
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // Define 'public/uploads' como destino.
    },
    // Define o nome do arquivo salvo.
    filename: function (req, file, cb) {
        // Cria um nome único para o arquivo usando o nome do campo, data atual e extensão original.
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

// Define um filtro para validar o tipo dos arquivos enviados.
const fileFilter = (req, file, cb) => {
    // Permite apenas arquivos com extensões .jpeg e .jpg.
    const extensoes = /jpeg|jpg/i;
    if (extensoes.test(path.extname(file.originalname))) {
        cb(null, true); // Aceita o arquivo.
    } else {
        // Rejeita o arquivo e retorna uma mensagem de erro.
        return cb('Arquivo não suportado. Apenas jpg e jpeg são suportados.');
    }
};

// Instancia o Multer com as configurações definidas.
var upload = multer({ storage: storage, fileFilter: fileFilter });

// ========================== Definição das Rotas ========================== //

// ROTA POST: Criação de post com autenticação e upload de foto.
router.post('/', autenticar, upload.single('foto')); // Faz upload de uma foto associada ao post.
router.post('/', autenticar, postMid); // Middleware adicional para validar o post.
router.put('/', autenticar, postMid); // Validação do post na atualização via PUT.

// ROTA GET: Retorna todos os posts cadastrados.
router.get('/', async (req, res) => {
    // Busca todos os posts no banco de dados.
    const posts = await Post.findAll();
    // Retorna a lista de posts no formato JSON.
    res.json({ posts: posts });
});

// ROTA GET: Retorna os detalhes de um post específico com informações do autor.
router.get('/:id', async (req, res) => {
    // Busca o post pelo ID informado e inclui os dados do autor (modelo `Usuario`).
    const post = await Post.findByPk(req.params.id, { include: [{ model: Usuario }], raw: true, nest: true });

    // Remove campos desnecessários da resposta.
    const postProcessado = prepararResultado(post);

    // Retorna o post processado no formato JSON.
    res.json({ posts: postProcessado });
});

// ROTA POST: Faz upload de uma foto para um post existente.
router.post('/:id/upload', upload.single('foto'), async (req, res) => {
    console.log(req.file); // Exibe os detalhes do arquivo no console.

    const id = req.params.id; // Obtém o ID do post.
    const post = await Post.findByPk(id); // Busca o post no banco de dados.
    if (post) {
        // Atualiza o campo `foto` do post com o caminho do arquivo enviado.
        post.foto = `/static/uploads/${req.file.filename}`;
        await post.save(); // Salva as alterações no banco.
        res.json({ msg: "Upload realizado com sucesso!" }); // Retorna uma mensagem de sucesso.
    } else {
        // Retorna erro caso o post não seja encontrado.
        res.status(400).json({ msg: "Post não encontrado!" });
    }
});

// ROTA POST: Cria um novo post.
router.post('/', async (req, res, next) => {
    const data = req.body; // Obtém os dados enviados no corpo da requisição.
    if (req.file) {
        // Se houver um arquivo enviado, define o caminho no campo `foto`.
        data.foto = `/static/uploads/${req.file.filename}`;
    }
    try {
        const post = await Post.create(data); // Cria o post no banco de dados.
        res.json({ msg: "Post adicionado com sucesso!" }); // Retorna mensagem de sucesso.
    } catch (err) {
        // Em caso de erro, utiliza o manipulador de erros personalizado.
        next(new ErrorHandler(500, 'Falha interna ao adicionar postagem'));
    }
});

// ROTA DELETE: Exclui um post pelo ID.
router.delete('/', async (req, res) => {
    const id = req.query.id; // Obtém o ID do post a partir dos parâmetros de consulta.
    const post = await Post.findByPk(id); // Busca o post pelo ID.
    if (post) {
        await post.destroy(); // Deleta o post do banco de dados.
        res.json({ msg: "Post deletado com sucesso!" }); // Retorna mensagem de sucesso.
    } else {
        // Retorna erro caso o post não seja encontrado.
        res.status(400).json({ msg: "Post não encontrado!" });
    }
});

// ROTA PUT: Atualiza os dados de um post existente.
router.put('/', async (req, res) => {
    const id = req.query.id; // Obtém o ID do post.
    const post = await Post.findByPk(id); // Busca o post pelo ID.
    if (post) {
        // Atualiza os campos do post com os dados recebidos na requisição.
        post.titulo = req.body.titulo;
        post.texto = req.body.texto;
        await post.save(); // Salva as alterações no banco de dados.
        res.json({ msg: "Post atualizado com sucesso!" }); // Retorna mensagem de sucesso.
    } else {
        // Retorna erro caso o post não seja encontrado.
        res.status(400).json({ msg: "Post não encontrado!" });
    }
});

// ========================== Funções Auxiliares ========================== //

// Função para preparar o resultado de um post antes de enviá-lo como resposta.
function prepararResultado(post) {
    const result = Object.assign({}, post); // Cria uma cópia do objeto post.
    // Remove campos desnecessários da resposta.
    if (result.createdAt) delete result.createdAt;
    if (result.updatedAt) delete result.updatedAt;
    if (result.userId) delete result.userId;
    if (result.Usuario) {
        if (result.Usuario.senha) delete result.Usuario.senha; // Remove o campo de senha.
        if (result.Usuario.createdAt) delete result.Usuario.createdAt;
        if (result.Usuario.updatedAt) delete result.Usuario.updatedAt;
    }
    return result; // Retorna o objeto post processado.
}

// ========================== Exportação ========================== //

// Exporta o roteador para ser usado em outras partes da aplicação.
module.exports = router;

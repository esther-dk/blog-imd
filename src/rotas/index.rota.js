// Importa o framework Express para criar rotas HTTP.
const express = require('express');

// Cria um roteador para gerenciar as rotas relacionadas a posts.
const router = express.Router();

// Importa os modelos `Post` e `Usuario` para interagir com o banco de dados.
const { Post, Usuario } = require('../db/models');

// Importa o Moment.js, uma biblioteca para manipulação de datas e formatação.
const moment = require('moment');
moment.locale('pt-br'); // Define o idioma como português do Brasil para formatação das datas.

// ========================== Rotas ========================== //

// ROTA GET: Lista os 10 posts mais recentes.
router.get('/', async (req, res) => {
    // Busca no banco os 10 posts mais recentes, ordenados por data de criação (decrescente),
    // incluindo os dados do autor (`Usuario`).
    const posts = await Post.findAll({
        limit: 10, // Limita o resultado a 10 posts.
        order: [['createdAt', 'DESC']], // Ordena pela data de criação (mais recentes primeiro).
        include: [{
            model: Usuario // Inclui os dados do autor associado a cada post.
        }],
        raw: true, // Retorna os dados como um objeto plano (sem instâncias de modelo).
        nest: true // Agrupa os dados relacionados em objetos aninhados (e.g., `Usuario` dentro de `Post`).
    });

    // Formata e limpa os dados dos posts para serem exibidos.
    const postResult = posts.map((post) => prepararResultado(post));

    // Renderiza a página `posts` localizada em `views/pages/posts.ejs`,
    // passando os posts formatados e definindo o layout principal.
    res.render('pages/posts', { posts: postResult, layout: 'layouts/layout-blog.ejs' });
});

// ROTA GET: Exibe os detalhes de um post específico, identificado pelo ID.
router.get('/post/:id', async (req, res) => {
    // Busca o post pelo ID fornecido na URL, incluindo os dados do autor (`Usuario`).
    const post = await Post.findByPk(req.params.id, {
        include: [{ model: Usuario }], // Inclui os dados do autor.
        raw: true, // Retorna os dados como um objeto plano.
        nest: true // Organiza os dados relacionados em objetos aninhados.
    });

    // Renderiza a página `post` localizada em `views/pages/post.ejs`,
    // passando os detalhes do post formatados e definindo o layout principal.
    res.render('pages/post', { post: prepararResultado(post), layout: 'layouts/layout-blog.ejs' });
});

// ========================== Funções Auxiliares ========================== //

// Função que processa e formata os dados de um post antes de enviá-lo para a view.
function prepararResultado(post) {
    // Cria uma cópia do post para evitar modificar o original.
    const result = Object.assign({}, post);

    // Formata a data de criação (`createdAt`) usando Moment.js no formato "DD de MMMM de yyyy às HH:mm".
    result.postadoEm = moment(new Date(result.createdAt)).format('DD [de] MMMM [de] yyyy [às] HH:mm');

    // Remove campos desnecessários para a exibição, como timestamps e IDs internos.
    if (result.createdAt) delete result.createdAt;
    if (result.updatedAt) delete result.updatedAt;
    if (result.userId) delete result.userId;

    // Remove dados sensíveis ou irrelevantes do objeto `Usuario`, como senha e timestamps.
    if (result.Usuario) {
        if (result.Usuario.senha) delete result.Usuario.senha;
        if (result.Usuario.createdAt) delete result.Usuario.createdAt;
        if (result.Usuario.updatedAt) delete result.Usuario.updatedAt;
    }

    // Retorna o objeto formatado e limpo.
    return result;
}

// ========================== Exportação ========================== //

// Exporta o roteador para ser utilizado no arquivo principal da aplicação.
module.exports = router;

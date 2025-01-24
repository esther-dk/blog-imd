// Importa o módulo express para criar e gerenciar rotas.
const express = require('express');

// Cria uma instância de roteador para organizar as rotas relacionadas a usuários.
const router = express.Router();

// Importa o middleware de validação de usuário para aplicar regras antes de certas operações.
const validarUsuario = require('../middleware/validarUsuario.middleware');

// Importa o modelo 'Usuario' da camada de banco de dados para interagir com a tabela de usuários.
const { Usuario } = require('../db/models');

// Importa as bibliotecas bcrypt para criptografia de senhas e jwt para geração de tokens de autenticação.
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// ROTA POST: Criação de um novo usuário
// Middleware de validação é aplicado antes da criação.
router.post('/', validarUsuario);

// ROTA PUT: Atualização de um usuário existente
// Middleware de validação é aplicado antes da atualização.
router.put('/', validarUsuario);

// ROTA GET: Listar todos os usuários
router.get('/', async (req, res) => {
  try {
    // Busca todos os usuários no banco de dados usando Sequelize.
    const usuarios = await Usuario.findAll();
    // Retorna os usuários encontrados no formato JSON.
    res.json({ usuarios: usuarios });
  } catch (error) {
    // Em caso de erro, retorna um status 500 e a mensagem do erro.
    res.status(500).json({ msg: "Erro ao buscar usuários", error });
  }
});

// ROTA GET: Buscar um usuário específico pelo ID
router.get('/:id', async (req, res) => {
  try {
    // Busca o usuário pelo ID fornecido nos parâmetros da URL.
    const usuario = await Usuario.findByPk(req.params.id);
    if (usuario) {
      // Se o usuário for encontrado, retorna os dados no formato JSON.
      res.json({ usuario: usuario });
    } else {
      // Se o usuário não for encontrado, retorna um erro 400 com mensagem apropriada.
      res.status(400).json({ msg: "Usuário não encontrado!" });
    }
  } catch (error) {
    // Em caso de erro, retorna um status 500 e a mensagem do erro.
    res.status(500).json({ msg: "Erro ao buscar usuário", error });
  }
});

// ROTA POST: Adicionar um novo usuário com criptografia de senha
router.post("/", async (req, res) => {
  try {
    // Recebe a senha do corpo da requisição e gera um salt para criptografia.
    const senha = req.body.senha;
    const salt = await bcrypt.genSalt(10);
    // Criptografa a senha usando bcrypt.
    const senhaCriptografada = await bcrypt.hash(senha, salt);
    // Cria o objeto do usuário com email e senha criptografada.
    const usuario = { email: req.body.email, senha: senhaCriptografada };
    // Adiciona o usuário ao banco de dados.
    const usuarioObj = await Usuario.create(usuario);
    // Retorna uma mensagem de sucesso e o ID do usuário criado.
    res.json({ msg: "Usuário adicionado com sucesso!", userId: usuarioObj.id });
  } catch (error) {
    // Em caso de erro, retorna um status 500 e a mensagem do erro.
    res.status(500).json({ msg: "Erro ao adicionar usuário", error });
  }
});

// ROTA POST: Login do usuário com validação de senha e geração de token JWT
router.post("/login", async (req, res) => {
  try {
    // Extrai o email e a senha do corpo da requisição.
    const email = req.body.email;
    const senha = req.body.senha;

    // Busca o usuário pelo email no banco de dados.
    const usuario = await Usuario.findOne({
      where: { email: email },
    });

    // Verifica se o usuário existe e se a senha fornecida corresponde à senha armazenada.
    if (usuario && (await bcrypt.compare(senha, usuario.senha))) {
      // Define o payload para o token JWT.
      const payload = {
        sub: usuario.id, // ID do usuário
        iss: "imd-backend", // Emissor do token
        aud: "imd-frontend", // Destinatário do token
        email: usuario.email, // Email do usuário
      };
      // Gera o token JWT com uma duração de 40 segundos.
      const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '40s' });
      // Retorna o token para o cliente.
      res.json({ accessToken: token });
    } else {
      // Retorna erro 403 se o login falhar.
      res.status(403).json({ msg: "Usuário ou senha inválidos" });
    }
  } catch (error) {
    // Em caso de erro, retorna um status 500 e a mensagem do erro.
    res.status(500).json({ msg: "Erro ao realizar login", error });
  }
});

// ROTA PUT: Atualizar um usuário existente
router.put('/', async (req, res) => {
  try {
    // Obtém o ID do usuário a partir dos parâmetros de consulta (query).
    const id = req.query.id;
    // Busca o usuário pelo ID.
    const usuario = await Usuario.findByPk(id);
    if (usuario) {
      // Atualiza as propriedades do usuário com os dados recebidos.
      usuario.email = req.body.email;
      usuario.senha = req.body.senha;
      // Salva as alterações no banco de dados.
      await usuario.save();
      // Retorna mensagem de sucesso.
      res.json({ msg: "Usuário atualizado com sucesso!" });
    } else {
      // Retorna erro 400 se o usuário não for encontrado.
      res.status(400).json({ msg: "Usuário não encontrado!" });
    }
  } catch (error) {
    // Em caso de erro, retorna um status 500 e a mensagem do erro.
    res.status(500).json({ msg: "Erro ao atualizar usuário", error });
  }
});

// ROTA DELETE: Deletar um usuário
router.delete('/', async (req, res) => {
  try {
    // Obtém o ID do usuário a ser deletado a partir dos parâmetros de consulta (query).
    const id = req.query.id;
    // Busca o usuário pelo ID.
    const usuario = await Usuario.findByPk(id);

    if (usuario) {
      // Tenta deletar o usuário.
      await usuario.destroy();
      // Retorna mensagem de sucesso após a remoção.
      res.json({ msg: "Usuário deletado com sucesso!" });
    } else {
      // Retorna erro 400 se o usuário não for encontrado.
      res.status(400).json({ msg: "Usuário não encontrado!" });
    }
  } catch (error) {
    // Em caso de erro, retorna um status 500 e a mensagem do erro.
    res.status(500).json({ msg: "Falha ao remover usuário", error });
  }
});

// Exporta o roteador para que possa ser utilizado em outras partes do aplicativo.
module.exports = router;

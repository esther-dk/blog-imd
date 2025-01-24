// Importa a biblioteca AJV (Another JSON Schema Validator) para validação de dados JSON
const Ajv = require('ajv')
// Cria uma instância do AJV, que será utilizada para compilar e validar os esquemas JSON
const ajv = new Ajv()
// Importa a biblioteca "ajv-formats", que adiciona suporte para formatos de dados como 'email', 'uri', etc.
const addFormats = require("ajv-formats")
// Importa o esquema de validação do usuário, definido em um arquivo externo
const usuarioSchema = require('../schema/usuario.schema')

// Adiciona os formatos padrões ao AJV para validação
addFormats(ajv)

// Função middleware para validar os dados de usuário no corpo da requisição
function validarUsuario(req, res, next){
    const usuario = req.body  // Obtém o corpo da requisição, que contém os dados do usuário
    const validate = ajv.compile(usuarioSchema)  // Compila o esquema de validação para o usuário usando AJV
    const valid = validate(usuario)  // Valida os dados do usuário com o esquema compilado

    if (valid){
        // Se os dados forem válidos, chama o próximo middleware ou controlador
        next()
    } else {
        // Caso os dados não sejam válidos, retorna um erro 400 (Bad Request) com as mensagens de erro
        res.status(400).json({msg: "Dados inválidos", erros: validate.errors})
    }
}

// Exporta a função para ser utilizada como middleware em outras partes da aplicação
module.exports = validarUsuario

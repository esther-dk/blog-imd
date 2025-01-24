// Importa a biblioteca AJV (Another JSON Schema Validator) para validação de dados JSON
const Ajv = require('ajv')
// Cria uma instância do AJV, que será utilizada para compilar e validar os esquemas JSON
const ajv = new Ajv()
// Importa o esquema de validação para o post, que define a estrutura esperada para os dados de um post
const postSchema = require('../schema/post.schema')

// Função middleware para validar os dados de um post no corpo da requisição
function validarPost(req, res, next){
    const post = req.body  // Obtém os dados do post do corpo da requisição

    // Verifica se o campo 'userId' está presente no corpo do post
    if (post.userId){
        // Se o campo 'userId' estiver presente, converte seu valor para um número (caso seja uma string)
        post.userId = Number(post.userId)
    }

    // Compila o esquema de validação para o post usando AJV
    const validate = ajv.compile(postSchema)
    // Valida os dados do post com o esquema compilado
    const valid = validate(post)

    if (valid){
        // Se os dados forem válidos, chama o próximo middleware ou controlador
        next()
    } else {
        // Caso os dados não sejam válidos, retorna um erro 400 (Bad Request) com as mensagens de erro
        res.status(400).json({msg: "Dados inválidos", erros: validate.errors})
    }
}

// Exporta a função para ser utilizada como middleware em outras partes da aplicação
module.exports = validarPost

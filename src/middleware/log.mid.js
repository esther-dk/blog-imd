// Importa o módulo 'logger' de um utilitário personalizado.
// Presume-se que o logger foi configurado para lidar com diferentes níveis de log (e.g., debug, info, error).
const logger = require("../utils/logger");

// Define o middleware 'logar', que será executado para todas as requisições
// nas rotas onde ele for aplicado.
function logar(req, res, next) {
    // Registra no nível 'debug' informações sobre a requisição:
    // - req.method: Método HTTP usado na requisição (e.g., GET, POST, PUT, DELETE).
    // - req.path: Caminho da rota acessada (e.g., '/api/posts').
    logger.debug('Requisição %s na rota %s', req.method, req.path);

    // Chama a próxima função/middleware na cadeia. Sem isso, a requisição ficaria pendente.
    next();
}

// Exporta o middleware 'logar' para que possa ser usado em outras partes da aplicação.
module.exports = logar;

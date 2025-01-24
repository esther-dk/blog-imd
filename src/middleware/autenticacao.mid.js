// Importa o módulo 'jsonwebtoken', que é usado para manipular tokens JWT.
const jwt = require('jsonwebtoken');

// Define o middleware 'autenticar', que verifica a autenticidade do token JWT.
function autenticar(req, res, next) {
    // Extrai o cabeçalho 'Authorization' da requisição.
    const auth = req.headers["authorization"];
    
    // Se o cabeçalho 'Authorization' existir, o token é extraído:
    // - 'auth.split(' ')[1]' assume que o formato do cabeçalho é: "Bearer <token>"
    const token = auth && auth.split(' ')[1];
    
    // Caso o token não esteja presente, retorna um status HTTP 401 (não autorizado).
    if (!token) {
        return res.sendStatus(401); // Sem autorização
    } else {
        // Valida o token JWT usando a chave secreta definida em 'process.env.ACCESS_TOKEN_SECRET'.
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            // Se houver um erro na validação (e.g., token expirado ou inválido),
            // retorna um status HTTP 403 (proibido).
            if (err) return res.sendStatus(403); // Proibido
            
            // Caso o token seja válido, o payload (dados contidos no token) é atribuído ao `req.user`.
            req.user = payload;

            // Passa o controle para o próximo middleware ou rota.
            next();
        });
    }
}

// Exporta o middleware 'autenticar' para que ele possa ser usado em outras partes da aplicação.
module.exports = autenticar;

// Define a classe 'ErrorHandler', que herda da classe nativa 'Error'.
class ErrorHandler extends Error {
    /**
     * Construtor da classe 'ErrorHandler'.
     * @param {number} statusCode - O código de status HTTP do erro.
     * @param {string} msg - A mensagem descritiva do erro.
     */
    constructor(statusCode, msg) {
        // Chama o construtor da classe base ('Error').
        super();

        // Define a propriedade 'statusCode' com o código de status HTTP do erro.
        this.statusCode = statusCode;

        // Define a propriedade 'msg' com a mensagem descritiva do erro.
        this.msg = msg;
    }
}

// Exporta a classe 'ErrorHandler' para que ela possa ser utilizada em outras partes da aplicação.
module.exports = ErrorHandler;

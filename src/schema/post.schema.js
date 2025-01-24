module.exports = {
    // Define o tipo do objeto como 'object'. O objeto que será validado deve ser deste tipo.
    type: "object",
    
    properties: {
        // Define que o objeto deve ter uma propriedade chamada 'titulo', que deve ser uma string e ter entre 5 e 100 caracteres.
        titulo: {type: "string", maxLength: 100, minLength: 5},
        
        // Define que o objeto deve ter uma propriedade chamada 'texto', que deve ser uma string (sem restrições adicionais).
        texto: {type: "string"},
        
        // Define que o objeto deve ter uma propriedade chamada 'userId', que deve ser um número inteiro.
        userId: {type: "integer"}
    },
    
    // Define que 'titulo', 'texto' e 'userId' são propriedades obrigatórias no objeto.
    required: ["titulo", "texto", "userId"],
    
    // Define que o objeto não pode ter propriedades adicionais além de 'titulo', 'texto' e 'userId'.
    additionalProperties: false
}

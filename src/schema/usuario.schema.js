module.exports = {
    // Define o tipo do objeto como 'object'. O objeto que será validado deve ser deste tipo.
    type: "object",
    
    properties: {
        // Define que o objeto deve ter uma propriedade chamada 'email', que deve ser uma string no formato de email.
        email: {type: "string", format: "email"},
        
        // Define que o objeto deve ter uma propriedade chamada 'senha', que deve ser uma string.
        senha: {type: "string"}
    },
    
    // Define que tanto 'email' quanto 'senha' são propriedades obrigatórias no objeto.
    required: ["email", "senha"],
    
    // Define que o objeto não pode ter propriedades adicionais além de 'email' e 'senha'.
    additionalProperties: false
}

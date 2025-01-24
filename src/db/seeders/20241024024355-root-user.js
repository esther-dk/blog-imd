// 'use strict' força o uso de um código mais seguro, evitando erros comuns
'use strict';

module.exports = {
    // Função que será executada quando a migração for aplicada (up)
    up: async (queryInterface, Sequelize) => {
        // Usa o método bulkInsert para adicionar dados na tabela 'Usuarios'
        await queryInterface.bulkInsert('Usuarios', [{
            // Dados do usuário a ser inserido
            email: 'root@gmail.com',  // Endereço de e-mail
            senha: 'd8fy83uu4j',      // Senha (em um cenário real, senhas devem ser criptografadas)
            createdAt: new Date(),    // Data de criação do registro (data atual)
            updatedAt: new Date()     // Data de atualização do registro (data atual)
        }]);
    },

    // Função que será executada quando a migração for revertida (down)
    down: async (queryInterface, Sequelize) => {
        // Usa o método bulkDelete para remover o usuário com o e-mail especificado
        await queryInterface.bulkDelete('Usuarios', {email: 'root@gmail.com'}, {});
    }
};

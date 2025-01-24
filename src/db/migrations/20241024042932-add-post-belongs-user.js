// Ativa o modo estrito do JavaScript, que aplica regras mais rigorosas para evitar erros.
'use strict';

// Define o módulo exportado, que será responsável por modificar o banco de dados (no caso, adicionar ou remover uma coluna da tabela 'Posts').
module.exports = {
  // A função 'up' é executada quando a migration é aplicada.
  up: async (queryInterface, Sequelize) => {
    // Verifica a descrição da tabela 'Posts' para saber quais colunas ela possui.
    const columnExists = await queryInterface.describeTable('Posts');
    
    // Se a coluna 'userId' não existir na tabela, será adicionada.
    if (!columnExists.userId) {
      // Adiciona a coluna 'userId' à tabela 'Posts'.
      await queryInterface.addColumn('Posts', 'userId', {
        type: Sequelize.INTEGER, // A coluna será do tipo inteiro (INTEGER).
        allowNull: false, // A coluna não pode ser nula (NULL).
      });
    }
  },

  // A função 'down' é executada quando a migration é revertida (desfeita).
  down: async (queryInterface, Sequelize) => {
    // Remove a coluna 'userId' da tabela 'Posts'.
    await queryInterface.removeColumn('Posts', 'userId');
  }
};

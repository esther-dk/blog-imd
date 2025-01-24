// Ativa o modo estrito do JavaScript, que aplica regras mais rigorosas para evitar erros.
'use strict';

// Define o módulo exportado, que será responsável por modificar o banco de dados (no caso, adicionar ou remover uma coluna da tabela 'Posts').
module.exports = {
  // A função 'up' é executada quando a migration é aplicada.
  up: async (queryInterface, Sequelize) => {
    // Retorna uma chamada para o método 'addColumn' do queryInterface, que adiciona uma coluna à tabela 'Posts'.
    return queryInterface.addColumn('Posts', 'foto', {
      // Define as características da nova coluna 'foto'.
      type: Sequelize.STRING // O tipo da coluna será 'STRING', ou seja, uma cadeia de caracteres (texto).
    });
  },

  // A função 'down' é executada quando a migration é revertida (desfeita).
  down: async (queryInterface, Sequelize) => {
    // Retorna uma chamada para o método 'removeColumn' do queryInterface, que remove a coluna 'foto' da tabela 'Posts'.
    return queryInterface.removeColumn('Posts', 'foto');
  }
};

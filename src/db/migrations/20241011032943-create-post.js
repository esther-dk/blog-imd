// Ativa o modo estrito do JavaScript, que aplica regras mais rigorosas para evitar erros.
'use strict';

// Declara o tipo de migration. Isso é importante para que o Sequelize saiba que esta é uma migration.
 /** @type {import('sequelize-cli').Migration} */

// Exporta o módulo com as operações de criação e remoção de tabela.
module.exports = {
  
  // A função 'up' é executada quando a migration é aplicada.
  async up(queryInterface, Sequelize) {
    
    // Cria a tabela 'Posts' no banco de dados.
    await queryInterface.createTable('Posts', {
      
      // Define a coluna 'id', que será a chave primária da tabela.
      id: {
        allowNull: false,       // A coluna não pode ser nula.
        autoIncrement: true,    // O valor será incrementado automaticamente.
        primaryKey: true,       // Esta coluna será a chave primária da tabela.
        type: Sequelize.INTEGER // O tipo da coluna será um número inteiro.
      },
      
      // Define a coluna 'titulo', do tipo string.
      titulo: {
        type: Sequelize.STRING  // A coluna 'titulo' será do tipo string (sequência de caracteres).
      },
      
      // Define a coluna 'texto', também do tipo string.
      texto: {
        type: Sequelize.STRING  // A coluna 'texto' será do tipo string (sequência de caracteres).
      },

      // Define a coluna 'createdAt', que armazenará a data de criação do registro.
      createdAt: {
        allowNull: false,       // A coluna não pode ser nula.
        type: Sequelize.DATE   // O tipo da coluna será uma data (DATE).
      },
      
      // Define a coluna 'updatedAt', que armazenará a data da última atualização do registro.
      updatedAt: {
        allowNull: false,       // A coluna não pode ser nula.
        type: Sequelize.DATE   // O tipo da coluna será uma data (DATE).
      }
    });
  },

  // A função 'down' é executada quando a migration é revertida (desfeita).
  async down(queryInterface, Sequelize) {
    
    // Remove a tabela 'Posts' do banco de dados.
    await queryInterface.dropTable('Posts');
  }
};

// Ativa o modo estrito do JavaScript, garantindo regras mais rigorosas de execução.
'use strict';

// Declaração do tipo da migration que é utilizada pelo Sequelize CLI. Isso é importante para que o Sequelize saiba como manipular a migration.
 /** @type {import('sequelize-cli').Migration} */

// Exporta a função de migração que possui duas funções principais: 'up' e 'down'.
module.exports = {
  
  // A função 'up' é chamada quando a migration é executada para aplicar a criação da tabela.
  async up(queryInterface, Sequelize) {
    
    // Criação da tabela 'Usuarios' no banco de dados.
    await queryInterface.createTable('Usuarios', {

      // A coluna 'id' será a chave primária da tabela 'Usuarios', é do tipo inteiro e será auto-incrementada.
      id: {
        allowNull: false,       // A coluna 'id' não pode ser nula.
        autoIncrement: true,    // O valor da coluna será gerado automaticamente (auto-incremento).
        primaryKey: true,       // Definindo esta coluna como chave primária.
        type: Sequelize.INTEGER // O tipo de dados da coluna será inteiro.
      },
      
      // A coluna 'email' armazenará os e-mails dos usuários, e será do tipo string (sequência de caracteres).
      email: {
        type: Sequelize.STRING  // O tipo de dados será uma string.
      },
      
      // A coluna 'senha' armazenará as senhas dos usuários, e também será do tipo string.
      senha: {
        type: Sequelize.STRING  // O tipo de dados será uma string.
      },

      // A coluna 'createdAt' armazenará a data e hora de criação do registro.
      createdAt: {
        allowNull: false,       // A coluna 'createdAt' não pode ser nula.
        type: Sequelize.DATE    // O tipo de dados será uma data (DATE).
      },
      
      // A coluna 'updatedAt' armazenará a data e hora da última atualização do registro.
      updatedAt: {
        allowNull: false,       // A coluna 'updatedAt' não pode ser nula.
        type: Sequelize.DATE    // O tipo de dados será uma data (DATE).
      }
    });
  },

  // A função 'down' é chamada para reverter a migration (remover a tabela).
  async down(queryInterface, Sequelize) {
    
    // Remove a tabela 'Usuarios' do banco de dados.
    await queryInterface.dropTable('Usuarios');
  }
};

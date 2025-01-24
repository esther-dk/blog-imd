// 'use strict' ativa o modo estrito do JavaScript, garantindo que o código siga regras mais rigorosas.
'use strict';

// Importa a classe Model do Sequelize, que será usada para definir o modelo de dados.
const { Model } = require('sequelize');

// O módulo exporta uma função que define o modelo de 'Usuario' no Sequelize.
module.exports = (sequelize, DataTypes) => {
  // Define a classe 'Usuario', que estende a classe Model do Sequelize.
  class Usuario extends Model {
    /**
     * Este método é responsável por definir as associações entre os modelos.
     * Este método não faz parte do ciclo de vida do Sequelize, mas será chamado automaticamente 
     * pelo arquivo 'models/index.js' durante a inicialização da aplicação.
     */
    static associate(models) {
      // Aqui seria onde as associações entre os modelos seriam definidas, por exemplo, 
      // associar 'Usuario' com outro modelo, como 'Post', se existisse tal relacionamento.
    }
  }

  // Chama o método 'init' do Sequelize para inicializar o modelo 'Usuario'.
  // Aqui, definimos os campos e seus tipos para o modelo de dados.
  Usuario.init({
    // Define o campo 'email' como uma string.
    email: DataTypes.STRING,
    // Define o campo 'senha' como uma string.
    senha: DataTypes.STRING
  }, {
    // Passa a instância do Sequelize para o modelo, permitindo que ele interaja com o banco de dados.
    sequelize,
    // Define o nome do modelo como 'Usuario'. Isso será usado para mapear a tabela do banco de dados.
    modelName: 'Usuario',
  });

  // Retorna o modelo de 'Usuario' para que possa ser utilizado em outras partes da aplicação.
  return Usuario;
};

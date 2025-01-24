// 'use strict' ativa o modo estrito do JavaScript, garantindo que o código siga regras mais rigorosas.
'use strict';

// Importa as classes Model e INTEGER do Sequelize. 'Model' é usada para definir modelos,
// e 'INTEGER' é um tipo de dado específico do Sequelize, embora não esteja sendo utilizado diretamente aqui.
const { Model, INTEGER } = require('sequelize');

// O módulo exporta uma função que define o modelo de 'Post' no Sequelize.
module.exports = (sequelize, DataTypes) => {
    // Define a classe 'Post', que estende a classe Model do Sequelize.
    class Post extends Model {

        // Método estático 'associate' para definir as associações entre modelos.
        static associate(models) {
            // Define uma associação "belongsTo" entre o modelo 'Post' e o modelo 'Usuario'.
            // Isso significa que um post pertence a um usuário (relacionamento 1:N).
            Post.belongsTo(models.Usuario, { foreignKey: 'userId' });
        }
    };

    // Chama o método 'init' do Sequelize para inicializar o modelo 'Post'.
    // Define os campos e seus tipos para o modelo de dados.
    Post.init({
        // Define o campo 'titulo' como uma string.
        titulo: DataTypes.STRING,
        // Define o campo 'texto' como uma string.
        texto: DataTypes.STRING,
        // Define o campo 'userId' como um número inteiro. Este campo será a chave estrangeira
        // que conecta um post ao seu usuário (relacionamento 1:N).
        userId: DataTypes.INTEGER,
        // Define o campo 'foto' como uma string. Pode ser usado para armazenar o caminho para uma imagem.
        foto: DataTypes.STRING
    }, {
        // Passa a instância do Sequelize para o modelo, permitindo que ele interaja com o banco de dados.
        sequelize,
        // Define o nome do modelo como 'Post'. Isso será usado para mapear a tabela do banco de dados.
        modelName: 'Post',
    });

    // Retorna o modelo de 'Post' para que possa ser utilizado em outras partes da aplicação.
    return Post;
};

// Ativa o modo estrito do JavaScript, que aplica regras mais rigorosas para evitar erros.
'use strict';

// Importa o módulo 'fs' (file system) do Node.js, usado para interagir com o sistema de arquivos.
const fs = require('fs');

// Importa o módulo 'path' do Node.js, utilizado para manipulação de caminhos de arquivos e diretórios.
const path = require('path');

// Importa a biblioteca Sequelize, que é usada para interagir com bancos de dados relacionais.
const Sequelize = require('sequelize');

// Importa o módulo 'process' do Node.js, utilizado para acessar informações do ambiente de execução.
const process = require('process');

// Define uma variável 'basename' que obtém o nome do arquivo atual (o nome do arquivo em que o código está sendo executado).
const basename = path.basename(__filename);

// Define uma variável 'env' que recebe o valor da variável de ambiente 'NODE_ENV', ou 'development' se não estiver definida.
const env = process.env.NODE_ENV || 'development';

// Importa a configuração do banco de dados do arquivo 'config.json' com base no ambiente (development, production, etc.).
const config = require(__dirname + '/../config/config.json')[env];

// Cria um objeto vazio 'db' que armazenará os modelos do Sequelize.
const db = {};

// Define a variável 'sequelize', que será uma instância do Sequelize, conectando ao banco de dados.
let sequelize;

// Se a configuração usar uma variável de ambiente para a string de conexão do banco de dados:
if (config.use_env_variable) {
  // Cria uma instância do Sequelize com a URL de conexão armazenada na variável de ambiente.
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Caso contrário, cria a instância do Sequelize com as informações de conexão do arquivo de configuração.
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Lê todos os arquivos do diretório atual e filtra os arquivos JavaScript, ignorando o arquivo atual e arquivos de teste.
fs
  .readdirSync(__dirname) // Lê o conteúdo do diretório atual.
  .filter(file => { // Filtra os arquivos de acordo com as condições abaixo:
    return (
      file.indexOf('.') !== 0 &&  // Ignora arquivos que começam com ponto (como '.DS_Store').
      file !== basename &&        // Ignora o arquivo atual (basename).
      file.slice(-3) === '.js' && // Apenas arquivos JavaScript (extensão '.js').
      file.indexOf('.test.js') === -1 // Ignora arquivos de teste (arquivos que contenham '.test.js').
    );
  })
  .forEach(file => { // Para cada arquivo que passou no filtro:
    // Carrega o modelo do arquivo e inicializa o modelo com a instância do Sequelize e os tipos de dados.
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    // Adiciona o modelo ao objeto 'db' usando o nome do modelo.
    db[model.name] = model;
  });

// Para cada modelo que foi carregado e adicionado ao objeto 'db':
Object.keys(db).forEach(modelName => {
  // Se o modelo tiver o método 'associate' (o que significa que o modelo possui associações):
  if (db[modelName].associate) {
    // Chama o método 'associate' do modelo para definir as associações entre os modelos.
    db[modelName].associate(db);
  }
});

// Adiciona a instância 'sequelize' e a classe 'Sequelize' ao objeto 'db' para que possam ser acessadas em outras partes da aplicação.
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Exporta o objeto 'db', que contém os modelos, a instância do Sequelize e as configurações do Sequelize,
// para que possa ser utilizado em outras partes da aplicação.
module.exports = db;

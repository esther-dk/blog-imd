// Importa as funções e classes necessárias do módulo Winston
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format; // Extração de métodos específicos para formatação de logs

/**
 * Define um formato customizado para as mensagens de log.
 * - level: O nível do log (e.g., debug, info, error).
 * - message: A mensagem que será registrada.
 * - label: (Opcional) Um rótulo para identificar a origem do log.
 * - timestamp: O horário em que o log foi gerado.
 */
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${level}] ${message}`; // Formato final das mensagens de log
});

// Cria o logger principal da aplicação
const logger = createLogger({
  // Define a formatação das mensagens de log
  format: combine(
    format.splat(),      // Permite interpolação de strings nas mensagens (e.g., %s, %d)
    timestamp(),         // Adiciona a data e hora aos logs
    myFormat             // Aplica o formato customizado às mensagens
  ),
  // Configura os destinos para onde os logs serão enviados
  transports: [
    // Envia logs para o console (útil para desenvolvimento e depuração)
    new transports.Console({
      level: 'debug' // Define o nível mínimo de log para o console
    }),
    // Salva logs em um arquivo (útil para produção e análise futura)
    new transports.File({
      filename: "logs/app-log.log", // Caminho do arquivo de log
      level: 'debug' // Define o nível mínimo de log para o arquivo
    })
  ]
});

// Exporta o logger para que ele possa ser usado em outras partes da aplicação
module.exports = logger;

//pontos importantes
//Interpolação é o ato de inserir ou substituir valores de variáveis diretamente dentro de uma string.
// Em programação, isso permite criar mensagens dinâmicas que combinam texto fixo e dados variáveis de forma prática.
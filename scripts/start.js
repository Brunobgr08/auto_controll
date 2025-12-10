const { spawn } = require('child_process');
const path = require('path');

// Caminho para o arquivo src/server.js
const serverPath = path.join(__dirname, '..', 'src', 'server.js');

// Executar src/server.js como processo principal
const serverProcess = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: process.env,
});

// Tratamento de erros do processo
serverProcess.on('error', (error) => {
  console.error('[ERROR] Falha ao iniciar o servidor:', error.message);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  process.exit(code);
});

// Encerrar o processo filho quando o pai for encerrado
process.on('SIGINT', () => {
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  serverProcess.kill('SIGTERM');
});

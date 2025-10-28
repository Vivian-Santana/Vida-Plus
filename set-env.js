const fs = require('fs');
const path = require('path');

if (process.env.NETLIFY) {
  const envDir = path.join(__dirname, 'src', 'environments');
  const envPath = path.join(envDir, 'environment.prod.ts');

  // Garante que a pasta existe
  fs.mkdirSync(envDir, { recursive: true });

  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    throw new Error('API_URL não está definida no ambiente Netlify.');
  }

  const targetEnv = `export const environment = {
  production: true,
  apiUrl: "${apiUrl}"
};
`;

  fs.writeFileSync(envPath, targetEnv, { encoding: 'utf8' });
  console.log('Arquivo environment.prod.ts gerado');
} else {
  console.log('Ignorando set-env.js fora do Netlify');
}
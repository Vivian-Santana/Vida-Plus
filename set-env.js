const fs = require('fs');
const path = require('path');

if (process.env.NETLIFY) {
    const envDir = path.join(__dirname, 'src', 'environments');
    fs.mkdirSync(envDir, { recursive: true });

    const apiUrl = process.env.API_URL;

    if (!apiUrl) {
        throw new Error('API_URL não está definida no ambiente Netlify.');
    }

    const prodPath = path.join(envDir, 'environment.prod.ts');
    const devPath = path.join(envDir, 'environment.ts');

    const prodEnv = `export const environment = {
  production: true,
  apiUrl: "${apiUrl}"
};
`;

    const devEnv = `export const environment = {
  production: false,
  apiUrl: "${apiUrl}"
};
`;

    fs.writeFileSync(prodPath, prodEnv, { encoding: 'utf8' });
    fs.writeFileSync(devPath, devEnv, { encoding: 'utf8' });

    console.log(`Arquivos gerados:
    - ${prodPath}
    - ${devPath}`);
} else {
    console.log('Ignorando set-env.js fora do Netlify');
}

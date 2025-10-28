const fs = require('fs');
const apiUrl = process.env.API_URL;

const envProd = `
export const environment = {
  production: true,
  apiUrl: '${apiUrl}'
};
`;

fs.writeFileSync('./src/environments/environment.prod.ts', envProd);

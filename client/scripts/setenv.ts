const { writeFile } = require('fs');
const { argv } = require('yargs');
// read environment variables from .env file
require('dotenv').config();
// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';

if (!process.env.TINK_APP_CLIENT_ID) {
   console.error('All the required environment variables were not provided!');
   process.exit(-1);
}

const targetPath = isProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`;

// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   TINK_APP_CLIENT_ID: "${process.env.TINK_APP_CLIENT_ID}",
};
`;
// write the content to the respective file
writeFile(targetPath, environmentFileContent, (err: any) => {
   if (err) {
      console.log(err);
   }
   console.log(`Wrote variables to ${targetPath}`);
});

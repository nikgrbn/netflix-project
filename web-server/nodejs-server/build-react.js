const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const dotenv = require('dotenv');

// Determine the correct environment file
const envFileName = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';

// Load the environment file
const envPath = path.resolve(__dirname, `../react-client/${envFileName}`);
dotenv.config({ path: envPath });

// Default port if undefined
const apiBaseUrl = `/api`;

// Path to the React folder
const reactClientPath = path.resolve(__dirname, '../react-client');

// Path to the .env file in the React folder
const envFilePath = path.join(reactClientPath, envFileName);

// Content for the .env file
const envContent = `REACT_APP_API_BASE_URL=${apiBaseUrl}\n`;

// Write the .env file
fs.writeFile(envFilePath, envContent, (err) => {
  if (err) {
    console.error('Error writing .env file:', err.message);
    return;
  }

  console.log(`${envFileName} file created with the following content:\n${envContent}`);

  // Build React
  console.log(`Building React with the following API_BASE_URL: ${apiBaseUrl}`);

  exec(
    `npm run build --prefix ${reactClientPath}`,
    (err, stdout, stderr) => {
      if (err) {
        console.error('Error building React:', err.message);
        return;
      }
      console.log(stdout);
      console.error(stderr);
    }
  );
});

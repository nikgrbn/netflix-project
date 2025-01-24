const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Default port if undefined
const port = process.env.PORT || 19844;
const apiBaseUrl = `http://localhost:${port}/api`;

// Path to the React folder
const reactClientPath = path.resolve(__dirname, '../react-client');

// Path to the .env file in the React folder
const envFilePath = path.join(reactClientPath, '.env');

// Content for the .env file
const envContent = `REACT_APP_API_BASE_URL=${apiBaseUrl}\nPORT=${port}\n`;

// Write the .env file
fs.writeFile(envFilePath, envContent, (err) => {
  if (err) {
    console.error('Error writing .env file:', err.message);
    return;
  }

  console.log(`.env file created with the following content:\n${envContent}`);

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

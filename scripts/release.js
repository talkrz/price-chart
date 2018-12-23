'use strict';
const fs = require('fs');
const { exec } = require('child_process');

function runTests() {
  return new Promise((resolve, reject) => {
    exec('npm test', (error, stdout, stderr) => {
      if (error) {
        reject(`Tests failed. Fix tests before release`);
      }
      resolve(stdout);
    });
  })
}

function getVersion() {
  const packageJson = JSON.parse(fs.readFileSync('./package.json'));
  return packageJson.version;
}

async function showReleaseCommands() {
  try {
    await runTests();
    console.log('\x1b[32mTests passed\x1b[0m');
    const version = getVersion();
    if (!version) {
      throw new Error(`Could not find version key in the package.json file`);
    }

    console.log('\x1b[32m%s\x1b[0m', 'Run following commands to release:\n');

    console.log('\x1b[2m%s\x1b[0m', '# Update package lock file');
    console.log('npm i');
    console.log('\x1b[2m%s\x1b[0m', '# Commit changes');
    console.log('git add package.json package-lock.json CHANGELOG.md');
    console.log(`git commit -m "Release version v${version}"`);
    console.log('git push origin master');
    console.log('\x1b[2m%s\x1b[0m', '# Tag new version');
    console.log(`git tag v${version}`);
    console.log('git push origin --tags');
    console.log('\x1b[2m%s\x1b[0m', '# Build & publish');
    console.log('npm run build');
    console.log('npm publish');
  } catch(error) {
    console.log('\x1b[31m%s\x1b[0m', error);
  }
}

showReleaseCommands();

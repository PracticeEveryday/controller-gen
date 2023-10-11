#!/usr/bin/env node
const { execSync } = require('child_process');

const runCommand = (command) => {
    try {
        execSync(`${command}`, { stdio: 'inherit' });
    } catch (e) {
        console.log(`Failed to execute ${command}`, e);
        return false;
    }
    return true;
};

const controllerName = process.argv[2];

const generateControllerFile = `node index.js ${controllerName}`;
console.log(`generate controller file with filename: ${controllerName}`);
const checkOut = runCommand(generateControllerFile);
if (!checkOut) process.exit(-1);


console.log(`${controllerName}Controller.ts success`)



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

const moduleName = process.argv[2];

const generateCommand = `npx nestjs-gen-mvc ${moduleName}`;
console.log(`generate controller file with filename: ${moduleName}`);
const checkOut = runCommand(generateCommand);
if (!checkOut) process.exit(-1);


console.log(`${moduleName}Controller.ts success`)



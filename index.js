#!/usr/bin/env node

const pack_json = require(__dirname + '/package.json');
const fs = require('fs');
const ejs = require('ejs');

const version = pack_json? pack_json.version : '<Unknown Version>'

const args = process.argv.slice(2)

const name = args[0];
const capitalizedName = capitalize(args[0]);



// Define the templates directory
const templatesDirectory = './templates';

// Get a list of template files in the directory
const templateFileArr = fs.readdirSync(templatesDirectory);

const targetDirectory =  args[0];

// 모듈 폴더 생성
if (!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory);
}

templateFileArr.forEach((templateFile) => {
    const template = fs.readFileSync(`./templates/${templateFile}`, 'utf8');

    const controllerContent = ejs.render(template, { name, capitalizedName });

    const fileName = templateFile.split(".")[0]
    const file = `${targetDirectory}/${name}.${fileName}.ts`;

    fs.writeFileSync(file, controllerContent);
    console.log(`Created ${file}`);
})


function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
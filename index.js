#!/usr/bin/env node

const pack_json = require(__dirname + '/package.json');
const fs = require('fs');
const ejs = require('ejs');

const version = pack_json? pack_json.version : '<Unknown Version>'

const args = process.argv.slice(2)

const controllerName = args[0];
const nameUpper = capitalize(args[0]);

// EJS 템플릿 파일 'controller.ejs'를 읽습니다.
const template = fs.readFileSync('./templates/controller.ejs', 'utf8');

// EJS를 사용하여 동적으로 컨트롤러 내용을 생성합니다.
const controllerContent = ejs.render(template, { name: controllerName, nameUpper });

const controllerFileName = `${controllerName}.controller.ts`;

fs.writeFileSync(controllerFileName, controllerContent);
console.log(`Created ${controllerFileName}`);

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
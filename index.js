#!/usr/bin/env node

const pack_json = require(__dirname + '/package.json');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

const version = pack_json? pack_json.version : '<Unknown Version>'

const args = process.argv.slice(2)

const name = args[0];
const capitalizedName = capitalize(args[0]);

const templatesDirectoryPath = './templates';

const targetDirectory =  args[0];

// 모듈 폴더 생성
if (!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory);
}
let isRoot = true;

function processTemplateArr (dir) {
    const fileArr = fs.readdirSync(dir);

    fileArr.forEach((file) => {
        const copyFile = file;
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            isRoot = false;

            const subDir = path.join(targetDirectory, file);
            if (!fs.existsSync(subDir)) {
                fs.mkdirSync(subDir);
            }

            // 폴더라면 재귀함수로 다시 진행
            processTemplateArr(filePath);
        } else {
            // TODO: file을 왜 선언이 되어 있지 않을까?
            // const template = fs.readFileSync(`./templates/${file}`, 'utf8');

            const template = fs.readFileSync(`${dir}/${copyFile}`, 'utf8');

            const content = ejs.render(template, {name, capitalizedName});

            const fileName = copyFile.split(".").slice(0, -1).join(".");

            let saveFilePath;
            if(dir.startsWith(".")) {
                saveFilePath = `${targetDirectory}/${name}.${fileName}.ts`;
            } else {
                const dirPath = dir.split("/").slice(1).join(".");
                saveFilePath = `${targetDirectory}/${dirPath}/${name}.${fileName}.ts`;
            }

            fs.writeFileSync(saveFilePath, content);
            console.log(`created ${file}`);
        }
    });
}

processTemplateArr(templatesDirectoryPath);

// --- Utils
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
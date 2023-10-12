#!/usr/bin/env node

const pack_json = require(__dirname + '/package.json');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

const version = pack_json? pack_json.version : '<Unknown Version>'

const args = process.argv.slice(2)

const name = args[0];
const capitalizedName = capitalize(name);

const templatesDirectoryPath = checkExistDir('./templates') ? './templates' : './node_modules/nestjs-gen-mvc/templates';

// 모듈 폴더 생성
createDirectoryIfNotExist(name);

processTemplateArr(templatesDirectoryPath);

function processTemplateArr (dirPath) {
    const fileArr = fs.readdirSync(dirPath);

    fileArr.forEach((file) => {
        const copyFile = file;
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            const subDir = path.join(name, file);
            createDirectoryIfNotExist(subDir)

            // 폴더라면 재귀함수로 다시 진행
            processTemplateArr(filePath);
        } else {
            // 파일 이라면
            // TODO: file을 왜 선언이 되어 있지 않을까?
            // const template = fs.readFileSync(`./templates/${file}`, 'utf8');

            const template = fs.readFileSync(`${dirPath}/${copyFile}`, 'utf8');
            const content = ejs.render(template, {name, capitalizedName});

            const fileName = copyFile.split(".").slice(0, -1).join(".");

            let createdFilePath;
            if(dirPath.startsWith(".")) {
                createdFilePath = `${name}/${name}.${fileName}.ts`;
            } else {
                const dirPath2 = dirPath.split("/").slice(3).join(".");
                createdFilePath = `${name}/${dirPath2}/${name}.${fileName}.ts`;
            }

            fs.writeFileSync(createdFilePath, content);
            console.log(`created ${file}`);
        }
    });
}



// --- Utils
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function createDirectoryIfNotExist(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

function checkExistDir (directoryPath) {
    try {
        fs.accessSync(directoryPath, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}
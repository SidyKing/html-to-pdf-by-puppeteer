const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require ('handlebars');
const path = require ('path');
const data = require("./database.json"); 
const moment = require('moment');
const express = require('express');
const app = express();
app.use(express.static('./templates'))
app.listen(3000);

const compile = async function(templateName, data) {
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
};




(async function(){
 try {
     const browser = await puppeteer.launch();
     const page = await browser.newPage();

    const content = await compile('shot-list', data);

     await page.setContent(content);
     await page.emulateMediaType('print');
     await page.pdf({
         path : 'mypdf.pdf',
         format : 'A4',
         printBackground : true
     });
     
     console.log('done');
     await browser.close();
     process.exit();
 } catch (e) {
     console.log('our error', e);
 }
})();
import puppeteer from "puppeteer";
import fs from "fs";
import { getGodDetails } from "./functions.js";

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();

await page.goto('https://www.smitegame.com/gods?lng=fr_FR')
await page.waitForSelector('.single__god', { timeout: 3000 });

const godsUrl = await page.$$eval('.single__god', gods => gods.map(god => god.href));
const newGodUrl = await page.$eval('.single__god--new', god => god.href);

await page.close();

const cluster = async (arrUrl) => {
    const gods = [];
    const page = await browser.newPage();
    for (const url of arrUrl) {
        gods.push(await getGodDetails(url, page))
    }
    return gods
}

function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(cluster(chunk));
    }
    return res;
}



//[...godsUrl, `${newGodUrl}--new`]
const gods = await Promise.all(sliceIntoChunks([newGodUrl, ...godsUrl], 12));
await browser.close();

fs.writeFile('gods.json', JSON.stringify(gods.flat(), null, 2), (err) => {
    if (err) throw err;
    console.log('Data written to file');
});


/*const achille = await getGodDetails(godsUrl[0], page)
const b = await getGodDetails(godsUrl[1], page)
const c = await getGodDetails(godsUrl[2], page)*/

//const res = await Promise.all(gods)

//console.log(res)
/*console.log(achille)
console.log(b)
console.log(c)*/

//console.log(body);




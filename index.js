// const http = require('http');
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
// });

// server.listen(port, () => {
//   console.log(`Server running at PORT:${port}/`);
// });
const puppeteer = require('puppeteer')
const fs = require('fs/promises')

async function scrape() {
    const browser = await puppeteer.launch({})
    const page = await browser.newPage()
    await page.goto('https://scholar.google.com/citations?view_op=view_citation&hl=ru&user=6qEK4u8AAAAJ&citation_for_view=6qEK4u8AAAAJ:UeHWp8X0CEIC')
//    await page.screenshot({path: "amazing.png", fullPage: true})
    const citiation_data = await page.evaluate(() => {
        return [
            {
               "title":"Muallif F.I.Sh",
               "value":"Nazirova  Raxnamoxon  Muxtorovna",
               "type":"inputautocomplete"
            },
            {
               "title":"Jurnalning nomi",
               "value": document.querySelectorAll('#gsc_oci_table > div:nth-child(7) > div.gsc_oci_value')[0].textContent,
               "type":"input"
            },
            {
               "title":"Jurnalning nashr etilgan yili va oyi",
               "value": document.querySelectorAll('#gsc_oci_table > div:nth-child(2) > div.gsc_oci_value')[0].textContent,
               "type":"input"
            },
            {
               "title":"Maqolaning nomi",
               "value": document.querySelectorAll('#gsc_oci_title > a')[0].textContent,
               "type":"input"
            },
            {
               "title":"Maqolaning qaysi tilda chop etilganligi",
               "value":"ingliz",
               "type":"input"
            },
            {
               "title":"Chop etilgan materiallarning \u00abGoogle Scholar\u00bb va boshqa xalqaro e'tirof etilgan qidiruv tizimlardagi internet manzili (giper xavolasi)",
               "value":"https:\/\/scholar.google.com\/citations?view_op=view_citation&hl=ru&user=-Lie5BYAAAAJ&cstart=20&pagesize=80&citation_for_view=-Lie5BYAAAAJ:p2g8aNsByqUC",
               "type":"input",
               "addition":"link"
            },
            {
               "title":"iqtiboslar soni",
               "value": document.querySelectorAll('#gsc_oci_table > div:nth-child(9) > div.gsc_oci_value > div:nth-child(1) > a')[0].textContent,
               "type":"number"
            },
            {
               "created":"14-09-2022 21:28",
               "indexId":"1d5",
               "user":"r.nazirova@ferpi.uz",
               "status":"complete",
               "comment":"",
               "pvoNames":"Nazirova  Raxnamoxon  Muxtorovna",
               "added_id":"10782",
               "grade":0.5,
               "value":1
            }
         ]
        // citiation_data[1].value = document.querySelectorAll('#gsc_oci_table > div:nth-child(3) > div.gsc_oci_value').textContent
        // citiation_data[1].value = document.querySelectorAll('#gsc_oci_table > div:nth-child(3) > div.gsc_oci_value')[0].textContent
    })
    // const text = await page.waitForSelector('.gsc_oci_title_link').innerText
    await fs.writeFile('names.txt', JSON.stringify(citiation_data));
//    for(i = 1; i < 6; i++){
//     var element = await page.waitForSelector("#meanings > div.css-ixatld.e15rdun50 > ul > li:nth-child(" + i + ") > a")
//     var text = await page.evaluate(element => element.textContent, element)
//     console.log(text)
//    }
   browser.close()
}
scrape()
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ScrapperService {
  async getDataViaPuppeteer() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://scholar.google.com/citations?view_op=view_citation&hl=ru&user=itSn6DMAAAAJ&citation_for_view=itSn6DMAAAAJ:9yKSN-GCB0IC');
    // const f = await page.$('#gsc_oci_title > a')
    // //obtain text
    // const text = await (await f.getProperty('textContent')).jsonValue()
    // console.log("Text is: " + text)
    const element = await page.waitForSelector('#gsc_oci_title > a'); // select the element
    const text = await element.evaluate(el => el.textContent); // grab the textCo
    console.log("Text is: " + text)
    await browser.close();
    return [];
  }
}

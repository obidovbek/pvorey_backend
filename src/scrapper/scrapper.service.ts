import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ScrapperService {
  async getDataViaPuppeteer() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://scholar.google.com/citations?view_op=view_citation&hl=ru&user=itSn6DMAAAAJ&citation_for_view=itSn6DMAAAAJ:9yKSN-GCB0IC');
    const element = await (await page.waitForSelector('#gsc_oci_title > a')).evaluate(el => el.textContent); // select the element
    console.log("Text is: 12" + element)
    await browser.close();

    return [];
  }
}

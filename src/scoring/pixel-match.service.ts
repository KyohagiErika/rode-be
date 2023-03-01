import { Injectable } from '@nestjs/common';
import pixelmatch from 'pixelmatch';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import * as fs from 'fs';
import { resolve } from 'path';
import { LocalFilesService } from '@local-files/local-files.service';

@Injectable()
export class PixelMatchService {
  constructor(private readonly localFilesService: LocalFilesService) {}

  async score(localFileId: string, htmlTemplate: string, css: string) {
    const [localFile, err] = await this.localFilesService.findOneById(
      localFileId,
    );
    if (err) {
      return [null, err];
    }
    const src = fs.readFileSync(
      resolve(__dirname + '/../../' + localFile.path),
    );
    const [target, err2] = await this.renderImage(htmlTemplate, css);
    if (err2) {
      return [null, err2];
    }
    return this.compareImageWithTemplate(src, target);
  }

  async test(css: string, htmlContent: string) {
    const pathToTemplate = resolve(
      __dirname + '/../../css-scoring/css-render.hbs',
    );
    const cssRender = fs.readFileSync(pathToTemplate);
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      dumpio: true,
      defaultViewport: {
        width: 300,
        height: 300,
      },
    });
    console.log(await browser.version());
    const page = await browser.newPage();
    await page.setContent(
      Handlebars.compile(cssRender.toString())({
        css: css,
        htmlContent: htmlContent,
      }),
      { waitUntil: 'networkidle0' },
    );
    const pngBuff = await page.screenshot({
      omitBackground: true,
      type: 'png',
    });
    fs.writeFileSync(
      resolve(__dirname + '/../../css-scoring/test.png'),
      pngBuff,
    );
    await browser.close();
  }

  async renderImage(htmlContent: string, css: string) {
    try {
      const pathToTemplate = resolve(
        __dirname + '/../../css-scoring/css-render.hbs',
      );
      const cssRender = fs.readFileSync(pathToTemplate);
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        dumpio: true,
        defaultViewport: {
          width: 300,
          height: 300,
        },
      });
      const page = await browser.newPage();
      await page.setContent(
        Handlebars.compile(cssRender.toString())({
          css: css,
          htmlContent: htmlContent,
        }),
        { waitUntil: 'networkidle0' },
      );
      const pngBuff = await page.screenshot({
        omitBackground: true,
        type: 'png',
      });
      await browser.close();
      return [pngBuff, null];
    } catch (err) {
      console.log(err);
      return [null, err];
    }
  }

  compareImageWithTemplate(src: Buffer, target: Buffer) {
    try {
      const diff = src;
      const match = pixelmatch(src, target, diff, 300, 300);
      return [{ diff: diff, match: match }, null];
    } catch (err) {
      console.log(err);
      return [null, err];
    }
  }
}

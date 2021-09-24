import readline from 'readline';
import * as fse from 'fs-extra';
import _ from 'lodash';
import path from 'path';

export function readLines(fileName: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const lines = [];

    readline.createInterface({ input: fse.createReadStream(fileName) })
      .on('line', (line) => lines.push(line))
      .on('close', () => resolve(lines))
      .on('error', reject);
  });
}

export async function payloadPriority(event?: string, eventFile?: string): Promise<string> {
  if (event && _.isString(event)) { return event; }
  if (!eventFile) { return null; }

  const absEventFile: string = path.resolve(process.cwd(), eventFile);
  if (!await fse.pathExists(absEventFile) || !fse.lstatSync(absEventFile).isFile) {
    throw new Error(`Event file: ${absEventFile} not exist.`);
  }

  return await getEvent(eventFile);
}

async function getEvent(eventFile): Promise<string> {
  return await new Promise((resolve, reject) => {
    const input: any = fse.createReadStream(eventFile, {
      encoding: 'utf-8',
    });
    const rl = readline.createInterface({
      input,
      output: process.stdout,
    });

    let event = '';
    rl.on('line', (line) => {
      event += line;
    });
    rl.on('close', () => {
      console.log();
      resolve(event);
    });

    rl.on('SIGINT', () => {
      reject(new Error('^C'));
    });
  });
}

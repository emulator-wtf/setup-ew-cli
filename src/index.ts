import { addPath, exportVariable, getInput, setFailed } from '@actions/core';
import { exec } from '@actions/exec';
import { cacheFile, downloadTool, find } from '@actions/tool-cache';

import { promises } from 'fs';
import { env } from 'process';

const EW_CLI_URL = "https://maven.emulator.wtf/releases/ew-cli";

export default async function setup() {
  try {
    const version = getInput('version');
    exportVariable('EW_VERSION', version);

    const cachedCli = find('emulatorwtf-wrapper', version);
    if (!cachedCli) {
      const path = await downloadTool(EW_CLI_URL);
      cacheFile(path, 'ew-cli', 'emulatorwtf-wrapper', version);
      addPath(path);
    }

    const cachedJar = find('emulatorwtf-jar', version);
    if (cachedJar) {
      await promises.copyFile(cachedJar, `${env.HOME}/.cache/emulator-wtf/ew-cli-${version}.jar`);
    }

    await exec('ew-cli --version');

    cacheFile(`${env.HOME}/.cache/emulator-wtf/ew-cli-${version}.jar`, 'ew-cli.jar', 'emulatorwtf-jar', version);
  } catch (e) {
    setFailed(e);
  }
}

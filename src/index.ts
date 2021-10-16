import { existsSync, promises } from 'fs';
import { env } from 'process';

import { addPath, exportVariable, getInput, setFailed } from '@actions/core';
import { exec } from '@actions/exec';
import { cacheFile, downloadTool, find } from '@actions/tool-cache';

const EW_CLI_URL = "https://maven.emulator.wtf/releases/ew-cli";

export default async function setup() {
  try {
    const version = getInput('version');
    exportVariable('EW_VERSION', version);

    const binPath = `${env.HOME}/.cache/emulator-wtf/bin`;
    await promises.mkdir(binPath, { recursive: true });

    const executable = `${binPath}/ew-cli`;
    if (existsSync(executable)) {
      const cachedCli = find('emulatorwtf-wrapper', version);
      if (!cachedCli) {
        const path = await downloadTool(EW_CLI_URL);
        cacheFile(path, 'ew-cli', 'emulatorwtf-wrapper', version);
        await promises.copyFile(path, executable);
      } else {
        await promises.copyFile(cachedCli, executable);
      }
    }
    addPath(binPath);

    const cachedJar = find('emulatorwtf-jar', version);
    if (cachedJar) {
      await promises.copyFile(cachedJar, `${env.HOME}/.cache/emulator-wtf/ew-cli-${version}.jar`);
    }

    await exec('ew-cli --version');

    if (!cachedJar) {
      cacheFile(`${env.HOME}/.cache/emulator-wtf/ew-cli-${version}.jar`, 'ew-cli.jar', 'emulatorwtf-jar', version);
    }
  } catch (e) {
    setFailed(e);
  }
}

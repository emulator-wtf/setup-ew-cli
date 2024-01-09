import { chmodSync, existsSync, promises } from 'fs';
import { env } from 'process';

import { addPath, debug, exportVariable, getInput, info, setFailed, warning } from '@actions/core';
import { exec } from '@actions/exec';
import { cacheFile, downloadTool, find } from '@actions/tool-cache';

const EW_CLI_URL = "https://maven.emulator.wtf/releases/ew-cli";

async function setup() {
  try {
    const version = getInput('version');
    exportVariable('EW_VERSION', version);

    const binPath = `${env.HOME}/.cache/emulator-wtf/bin`;
    debug(`Creating ${binPath}`);
    await promises.mkdir(binPath, { recursive: true });

    const executable = `${binPath}/ew-cli`;
    if (!existsSync(executable)) {
      debug(`${executable} doesn't exist, looking in cache`);
      const cachedCli = find('emulatorwtf-wrapper', version);
      if (!cachedCli) {
        debug(`ew-cli not found in cache, downloading....`);
        const path = await downloadTool(EW_CLI_URL);
        cacheFile(path, 'ew-cli', 'emulatorwtf-wrapper', version);
        await promises.copyFile(path, executable);
      } else {
        debug(`ew-cli not found in cache!`);
        await promises.copyFile(cachedCli, executable);
      }
    }
    chmodSync(executable, "755");
    addPath(binPath);

    const cachedJar = find('emulatorwtf-jar', version);
    debug(`looking for jar in cache!`);
    if (cachedJar) {
      debug(`Jar found in cache!`);
      await promises.copyFile(cachedJar + "/ew-cli.jar", `${env.HOME}/.cache/emulator-wtf/ew-cli-${version}.jar`);
    }

    await exec('ew-cli --version');

    if (!cachedJar) {
      debug(`Caching jar...`);
      cacheFile(`${env.HOME}/.cache/emulator-wtf/ew-cli-${version}.jar`, 'ew-cli.jar', 'emulatorwtf-jar', version);
    }
  } catch (e) {
    warning(`ew-cli installation failed: ${e}`);
    setFailed(e);
  }
}

setup();

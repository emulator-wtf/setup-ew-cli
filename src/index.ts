import { chmodSync, existsSync, promises } from 'fs';
import { env } from 'process';

import { addPath, exportVariable, getInput, info, setFailed, warning } from '@actions/core';
import { getExecOutput } from '@actions/exec';
import { cacheFile, downloadTool, find } from '@actions/tool-cache';

const EW_CLI_URL = "https://maven.emulator.wtf/releases/ew-cli";

export default async function setup() {
  try {
    const version = getInput('version');
    exportVariable('EW_VERSION', version);

    const binPath = `${env.HOME}/.cache/emulator-wtf/bin`;
    info(`Creating ${binPath}`);
    await promises.mkdir(binPath, { recursive: true });

    const executable = `${binPath}/ew-cli`;
    if (!existsSync(executable)) {
      info(`${executable} doesn't exist, looking in cache`);
      const cachedCli = find('emulatorwtf-wrapper', version);
      if (!cachedCli) {
        info(`ew-cli not found in cache, downloading....`);
        const path = await downloadTool(EW_CLI_URL);
        cacheFile(path, 'ew-cli', 'emulatorwtf-wrapper', version);
        await promises.copyFile(path, executable);
      } else {
        info(`ew-cli not found in cache!`);
        await promises.copyFile(cachedCli, executable);
      }
    }
    chmodSync(executable, "755");
    addPath(binPath);

    const cachedJar = find('emulatorwtf-jar', version);
    info(`looking for jar in cache!`);
    if (cachedJar) {
      info(`Jar found in cache!`);
      await promises.copyFile(cachedJar, `${env.HOME}/.cache/emulator-wtf/ew-cli-${version}.jar`);
    }

    const versionOutput = await getExecOutput('ew-cli --version');
    info('ew-cli installed:');
    info(versionOutput.stdout);

    if (!cachedJar) {
      info(`Caching jar...`);
      cacheFile(`${env.HOME}/.cache/emulator-wtf/ew-cli-${version}.jar`, 'ew-cli.jar', 'emulatorwtf-jar', version);
    }
  } catch (e) {
    warning(`ew-cli installatopn failed: ${e}`);
    setFailed(e);
  }
}

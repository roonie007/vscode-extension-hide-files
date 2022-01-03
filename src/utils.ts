import {
  workspace,
  window,
  OutputChannel,
  ExtensionContext,
  RelativePattern,
} from "vscode";

import * as fs from "fs";
import { HiddenFilesProvider } from "./HiddenFilesProvider";
import { refresh, registerCommands } from "./commands";
import {
  getExludedFiles,
  saveDefaultExclude,
  saveExcludeFiles,
} from "./config";
import { join } from "path";

export let hiddenFilesProvider: HiddenFilesProvider;
let uConsole: OutputChannel;
export const rootFolder = workspace.workspaceFolders?.[0].uri.path as string;

export const $log = (str: string | unknown) => {
  if (!uConsole) {
    uConsole = window.createOutputChannel("Hide files");
  }

  uConsole.appendLine(
    typeof str === "string" ? str : JSON.stringify(str, null, 2)
  );
};

export const exists = (path: string) => {
  return fs.existsSync(path);
};
export const isDirectory = (path: string) => {
  return fs.statSync(path).isDirectory();
};

export const resetSettings = (fullReset = true) => {
  saveDefaultExclude(fullReset);

  const excludedFiles = getExludedFiles();
  if (excludedFiles.length === 0) {
    saveExcludeFiles([]);
  } else {
    $log(`Excluded files => ${JSON.stringify(excludedFiles, null, 2)}`);
  }
};

export const init = (context: ExtensionContext) => {
  hiddenFilesProvider = new HiddenFilesProvider();
  registerCommands(context);

  resetSettings();

  workspace.onDidDeleteFiles((e) => {
    let shouldReset = false;
    for (const { path } of e.files) {
      if (
        path.endsWith(".vscode/settings.json") ||
        path.endsWith(".vscode/") ||
        path.endsWith(".vscode")
      ) {
        shouldReset = true;
        break;
      }
    }

    setTimeout(() => {
      if (shouldReset) {
        resetSettings(false);
      }

      refresh();
    }, 1000);
  });
};

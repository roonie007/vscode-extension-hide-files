import { workspace, window, OutputChannel, ExtensionContext } from "vscode";

import * as fs from "fs";
import { HiddenFilesProvider } from "./HiddenFilesProvider";
import { registerCommands } from "./commands";
import { getExludedFiles, saveDefaultExclude } from "./config";

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

export const init = (context: ExtensionContext) => {
  saveDefaultExclude();

  hiddenFilesProvider = new HiddenFilesProvider();
  registerCommands(context);

  $log(`Excluded files => ${JSON.stringify(getExludedFiles(), null, 2)}`);
};

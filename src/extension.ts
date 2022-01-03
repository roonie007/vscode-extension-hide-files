import { window, ExtensionContext } from "vscode";
import { saveDefaultExclude } from "./config";
import { init, hiddenFilesProvider } from "./utils";

export function activate(context: ExtensionContext) {
  init(context);

  window.registerTreeDataProvider("hidden-files", hiddenFilesProvider);
  window.createTreeView("hidden-files", {
    treeDataProvider: hiddenFilesProvider,
  });
}

export function deactivate() {
  saveDefaultExclude();
}

import { ExtensionContext, commands } from "vscode";
import { excludeFiles, includeFile } from "./config";
import { $log, hiddenFilesProvider } from "./utils";

interface VsCodeFile {
  path: string;
}

export const hide = (...args: [VsCodeFile, Array<VsCodeFile>]): void => {
  const [firstFile, files] = args;
  const filesToExclude = files
    .filter((file) => typeof file.path === "string")
    .map((file) => file.path);

  filesToExclude.unshift(firstFile.path);

  excludeFiles(filesToExclude);
  refresh();
};

export const show = (fileRelativePath: string): void => {
  includeFile(fileRelativePath);
  refresh();
};

export const refresh = (): void => {
  setTimeout(() => {
    if (hiddenFilesProvider) {
      // Refresh HIDDEN FILES view
      hiddenFilesProvider.refresh();

      // Refresh EXPLORER view
      commands.executeCommand("workbench.files.action.refreshFilesExplorer");
    }
  }, 1000);
};

export const registerCommands = (context: ExtensionContext) => {
  const hideFilesCommands: Array<[string, (...args: any[]) => any]> = [
    ["hide-files.hide", hide],
    ["hide-files.show", show],
    ["hide-files.refresh", refresh],
  ];

  for (const [command, handler] of hideFilesCommands) {
    context.subscriptions.push(commands.registerCommand(command, handler));
    $log(`Registred command ${command}`);
  }
};

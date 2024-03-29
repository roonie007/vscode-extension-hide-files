import { WorkspaceConfiguration, workspace } from "vscode";
import { refresh } from "./commands";
import { rootFolder } from "./utils";

const defaultExclude: Record<string, boolean> = {};

export const workspaceFilesConfiguration = (): WorkspaceConfiguration => {
  return workspace.getConfiguration(
    "files",
    workspace.workspaceFolders?.[0].uri
  );
};

export const saveDefaultExclude = (calculateDefaultExclude = true) => {
  if (calculateDefaultExclude) {
    const exclude = workspaceFilesConfiguration().get("exclude") as Record<
      string,
      boolean
    >;

    const excluded = getExludedFiles();
    for (const key in exclude) {
      if (excluded.includes(key) === false) {
        defaultExclude[key] = true;
      }
    }

    workspaceFilesConfiguration().update("exclude", exclude);
  } else {
    workspaceFilesConfiguration().update("exclude", defaultExclude);
  }
};

export const getConfig = (): WorkspaceConfiguration => {
  return workspace.getConfiguration("hide-files");
};

export const updateFilesView = async () => {
  // wait to make sure the files are updated
  await new Promise((resolve) => setTimeout(resolve, 200));

  const files = getExludedFiles();
  const exclude = { ...defaultExclude };

  if (files.length > 0) {
    for (const file of files) {
      exclude[file] = true;
    }
  }

  workspaceFilesConfiguration().update("exclude", exclude);
};
export const saveExcludeFiles = (files: Array<string>) => {
  getConfig().update("files", files);
  updateFilesView();
};
export const includeFile = (relativePath: string) => {
  const files = getExludedFiles();

  const toIncludeIndex = files.findIndex((file) => file === relativePath);
  if (toIncludeIndex !== -1) {
    files.splice(toIncludeIndex, 1);
  }
  saveExcludeFiles(files);
};

export const excludeFiles = (paths: Array<string>) => {
  const files = getExludedFiles();

  for (const path of paths) {
    if (path) {
      let cleanFileOrDirPath = path
        .replace(rootFolder + "/", "")
        .replace(rootFolder, "");

      if (files.includes(cleanFileOrDirPath) === false) {
        files.push(cleanFileOrDirPath);
      }
    }
  }

  saveExcludeFiles(files);
};

export const getExludedFiles = (): Array<string> => {
  let files = getConfig().get("files") as Array<string>;
  if (!files) {
    files = [];
  }

  return files;
};

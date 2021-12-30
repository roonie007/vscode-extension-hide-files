import {
  TreeDataProvider,
  TreeItem,
  EventEmitter,
  Event,
  Command,
  TreeItemCollapsibleState,
} from "vscode";
import { getExludedFiles } from "./config";

export class HiddenFilesProvider implements TreeDataProvider<TreeItem> {
  constructor() {}

  getTreeItem(element: TreeItem): TreeItem {
    return element;
  }

  getChildren(element?: TreeItem) {
    const files = getExludedFiles();

    return files.map((file) => {
      const item = new File(file, {
        command: "hide-files.show",
        title: "Show",
        arguments: [file],
      });

      return item;
    });
  }

  private _onDidChangeTreeData: EventEmitter<
    TreeItem | undefined | null | void
  > = new EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: Event<TreeItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class File extends TreeItem {
  constructor(public readonly label: string, command: Command) {
    super(label, TreeItemCollapsibleState.None);

    this.command = command;
  }
}

import * as Types from "./types";

import { App } from "./app";
import { Container } from "inversify";
import { FileSystem } from "./file_system";

export function performBind(container: Container) {
  container.bind<App>(Types.App).to(App);

  container.bind<FileSystem>(Types.FileSystem).to(FileSystem);
}

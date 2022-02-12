import { Add } from "./add";
import { LibModule } from "../lib";

export class CoreLib implements LibModule {
  public readonly isModule: true;

  public readonly name = "core";

  public readonly entries = {
    [Add.name]: Add,
  };
}

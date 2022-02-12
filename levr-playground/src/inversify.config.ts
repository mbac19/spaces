import { Container } from "inversify";
import { xlispBindings } from "@levr/xlisp";

export function performBind(container: Container) {
  xlispBindings(container);
}

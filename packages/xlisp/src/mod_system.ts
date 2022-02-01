export interface ModuleSearchDef {
  fromPath: string;
  targetKey: string;
}

export interface IModSystem<Source> {
  findModule(search: ModuleSearchDef): string | undefined;

  getModuleSource(atPath: string): Source;
}

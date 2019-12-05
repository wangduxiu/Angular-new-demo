export interface Definition {
  id: string;
  name?: string; // optional since it's used for contract detail types, types that don't have names yet during the first step of the initialisation
  title?: string;
  defaultValue?: boolean;
}

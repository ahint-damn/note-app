export interface ContextMenuItem {
  label: string;
  action: (args?: any) => void;
  args?: any;
}

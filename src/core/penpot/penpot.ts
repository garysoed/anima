export interface PenpotColorToken {
  readonly $description?: string;
  readonly $type: 'color';
  readonly $value: string;
}

export type PenpotTokenTree = {
  readonly [key: string]: PenpotColorToken | PenpotTokenTree;
};

export interface PenpotExportData {
  readonly $metadata?: {
    readonly activeSets?: readonly string[];
    readonly tokenSetOrder: readonly string[];
  };
  readonly palette: PenpotTokenTree;
  readonly theme: PenpotTokenTree;
}

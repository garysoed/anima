export interface PenpotColorToken {
  readonly $description?: string;
  readonly $type: 'color';
  readonly $value: string;
}

export interface PenpotTypographyToken {
  readonly $description?: string;
  readonly $type: 'typography';
  readonly $value: {
    readonly fontFamily: string;
    readonly fontSize: string;
    readonly fontWeight: number | string;
    readonly letterSpacing?: number | string;
    readonly lineHeight: number | string;
    readonly textCase?: string;
    readonly textDecoration?: string;
  };
  readonly [key: string]: unknown;
}

export type PenpotTokenTree = {
  readonly [key: string]:
    PenpotColorToken | PenpotTokenTree | PenpotTypographyToken;
};

export interface PenpotExportData {
  readonly $metadata?: {
    readonly activeSets?: readonly string[];
    readonly tokenSetOrder: readonly string[];
  };
  readonly palette: PenpotTokenTree;
  readonly theme: PenpotTokenTree;
}

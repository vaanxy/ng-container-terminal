import { InjectionToken } from '@angular/core';

export interface VescellParserConfig {
  pattern: string;
}

export const VESCELL_PARSER_CONFIG = new InjectionToken<VescellParserConfig>(
  'vescellParserConfig'
);

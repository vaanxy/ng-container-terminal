import { InjectionToken } from '@angular/core';


export interface YardposParserConfig {
    pattern: string;
}

export const YARDPOS_PARSER_CONFIG = new InjectionToken<YardposParserConfig>('yardposParserConfig');

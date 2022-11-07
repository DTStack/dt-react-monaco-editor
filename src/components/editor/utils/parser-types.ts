type IdentifierChain = { name: string }[];

interface ILocation {
    first_column: number;
    first_line: number;
    last_column: number;
    last_line: number;
}

interface ILocationInfo {
    type: string;
    missing?: boolean;
    location: ILocation;
    identifierChain: IdentifierChain;
}

interface IColumn {
    identifierChain: IdentifierChain;
    location: ILocation;
    type: string;
}

interface IDefinition {
    columns?: IColumn[];
    identifierChain: IdentifierChain;
    location: ILocation;
    type: string;
}

interface ISuggestKeyword {
    value: string;
    weight: number;
}

export interface IAutoComplete {
    definitions: IDefinition[];
    locations: ILocationInfo[];
    lowerCase: boolean;
    suggestColumns?: {
        tables?: { identifierChain: IdentifierChain } [];
        source?: string;
    };
    suggestTables?: { identifierChain: IdentifierChain };
    suggestKeywords?: ISuggestKeyword[];
    suggestAggregateFunctions?: any;
    suggestAnalyticFunctions?: any;
    [props: string]: any;
}

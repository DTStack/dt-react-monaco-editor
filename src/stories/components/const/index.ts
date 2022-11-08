export * from './sqlText';

export const currentSchemaTableColumnMap: [string, string[]][] = [
    ['table_1_1', ['name', 'age', 'sex']],
    ['table_1_2', ['price', 'weight']],
    ['table_1_3', ['width', 'high', 'long']]
]

export const schemaTableColumnMap: [string, string, string[]][] = [
    ['schema1', 'table_1_1', ['name', 'age', 'sex']],
    ['schema1', 'table_1_2', ['price', 'weight']],
    ['schema1', 'table_1_3', ['width', 'high', 'long']],
    ['schema2', 'table_2_1', ['size', 'weight']],
    ['schema2', 'table_2_2', ['id', 'type', 'size', 'count']],
    ['schema2', 'table_2_3', ['level', 'name', 'type', 'id']]
];

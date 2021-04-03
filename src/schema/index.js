import { join } from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

const typesArray = loadFilesSync(join(__dirname, '.'), {
  extensions: ['graphql'],
  ignoreIndex: true,
});

const typeDefs = mergeTypeDefs(typesArray);
/**
 * Uncomment if you want to see the final result
 * of schemas files merged
 */
// import { print } from 'graphql';
// import fs from 'fs'; /*  */
// const printedTypeDefs = print(typeDefs);
// fs.writeFileSync(join(__dirname, '.', 'schema.graphql'), printedTypeDefs);

export default typeDefs;

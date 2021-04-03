import { join } from 'path';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { print } from 'graphql';
import fs from 'fs';

export async function buildSchema() {
  const schemasPath = join(__dirname, '../schema');

  const typesArray = await loadFiles(schemasPath, {
    extensions: ['graphql'],
    ignoreIndex: true,
  });

  const typeDefs = mergeTypeDefs(typesArray);
  /**
   * Uncomment if you want to see the final result
   * of schemas files merged
   */
  const printedTypeDefs = print(typeDefs);
  await new Promise((resolve, reject) => {
    fs.writeFile(
      join(schemasPath, 'schema.graphql'),
      printedTypeDefs,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });

  return typeDefs;
}

export async function run() {
  await buildSchema();
  console.log('\x1b[33m%s\x1b[0m', `Schema build complete`);
}

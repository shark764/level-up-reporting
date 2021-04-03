import { join } from 'path';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeResolvers } from '@graphql-tools/merge';

export async function buildResolvers() {
  const resolversArray = await loadFiles(join(__dirname, '../resolvers'), {
    extensions: ['js'],
    ignoreIndex: true,
  });

  return mergeResolvers(resolversArray);
}

export async function run() {
  await buildResolvers();
  console.log('\x1b[33m%s\x1b[0m', `Resolvers generator complete`);
}

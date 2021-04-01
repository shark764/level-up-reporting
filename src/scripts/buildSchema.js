import fs from 'fs-extra';
import path from 'path';
import { graphql } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';

import Schema from '../schema';

async function buildSchema() {
  await fs.ensureFile('../data/schema.graphql.json');
  await fs.ensureFile('../data/schema.graphql');

  fs.writeFileSync(
    path.join(__dirname, '../data/schema.graphql.json'),
    JSON.stringify(await graphql(Schema, introspectionQuery), null, 2)
  );

  fs.writeFileSync(
    path.join(__dirname, '../data/schema.graphql.txt'),
    printSchema(Schema)
  );
}

async function run() {
  await buildSchema();
  console.log('\x1b[33m%s\x1b[0m', `Schema build complete`);
}

run().catch((e) => {
  console.log(
    '\x1b[31m%s\x1b[0m',
    `An error ocurred while attepmting to build schema...`,
    e
  );
  process.exit(0);
});

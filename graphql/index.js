// const path = require('path');
// const { loadFilesSync } = require('graphql-tools')
const { mergeResolvers } = require('@graphql-tools/merge');
const { makeExecutableSchema } = require('@graphql-tools/schema');

// const resolversArray = loadFilesSync(path.join(__dirname, './resolvers/*.resolver.js'));
// const schemaArray = loadFilesSync(path.join(__dirname, './schema/*.schema.js'));

const workspaceResolver = require('./resolvers/workspace.resolver');
const userResolver = require('./resolvers/user.resolver');

// const workspaceSchema = require('./schema/workspace.schema');
// const userSchema = require('./schema/user.schema');
const schema = require('./schema/schema');

module.exports = {
  resolvers: mergeResolvers([workspaceResolver, userResolver]),
  schemas: makeExecutableSchema({
    typeDefs: [schema],
  }),
};

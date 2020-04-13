module.exports = {
  service: {
    name: "anm"
  },
  client: {
    service: {
      name: "Local Schema File",
      localSchemaFile: "./schema.graphql"
    },
    includes: [
      "./packages/client/src/_graphql/**",
      "./packages/client/src/utils/sitemap.js"
    ]
  }
};

import { defineBackend } from "@aws-amplify/backend";

// Use require to avoid TS module resolution issues with .js resource files.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { beaverApi } = require("./functions/beaver-api/resource.js");

defineBackend({
  beaverApi,
});

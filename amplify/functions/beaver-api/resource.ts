import { defineFunction } from "@aws-amplify/backend";

export const beaverApi = defineFunction({
  name: "beaver-api",
  entry: "./index.js",
});

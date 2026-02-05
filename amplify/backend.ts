import { defineBackend } from "@aws-amplify/backend";
import { beaverApi } from "./functions/beaver-api/resource";

defineBackend({
  beaverApi,
});

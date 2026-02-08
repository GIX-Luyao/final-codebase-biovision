import { defineAuth } from "@aws-amplify/backend";

// Email + password auth via Cognito User Pool.
// (No Google/OAuth providers yet.)
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});


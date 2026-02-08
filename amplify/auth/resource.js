import { defineAuth } from "@aws-amplify/backend";

// Email + password auth via Cognito User Pool (no social providers yet).
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});


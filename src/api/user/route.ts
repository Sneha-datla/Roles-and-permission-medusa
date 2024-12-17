import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";
import createUserWorkflow from "../../workflows/create-user"; // Import the createUserWorkflow

type RequestBody = {
  first_name: string;
  last_name: string;
  email: string;
};

export async function POST(req: AuthenticatedMedusaRequest<RequestBody>, res: MedusaResponse) {
  // If `actor_id` is present, the request carries authentication for an existing user
  if (req.auth_context.actor_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Request already authenticated as a user."
    );
  }

  const { result } = await createUserWorkflow(req.scope).run({
    input: {
      user: req.body,
      authIdentityId: req.auth_context.auth_identity_id, // Link to the AuthIdentity
    },
  });

  res.status(200).json({ user: result });
}

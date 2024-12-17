import {
    AuthenticatedMedusaRequest,
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http";
  import {
    ContainerRegistrationKeys,
  } from "@medusajs/framework/utils";
  
  export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
  ) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  
    // Assuming actor_id is available in the request context (e.g., req.auth_context.actor_id)
    const actorId = req.auth_context.actor_id;
  
    const { data: user } = await query.graph({
      entity: "user",
      filters: {
        id: actorId,  // Filtering the query by actor_id
      },
      fields: ["first_name", "last_name", "email", "role.*","store.name"], // Fetching the role data
    });
  
    res.json({ user });
  };
  
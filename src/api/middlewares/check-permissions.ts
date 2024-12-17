import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils";

interface User {
  id: string;
  role?: {
    id: string;
    name: string;
    permissions: string[];
  };
}

export const checkPermissions = (requiredPermissions: string[]) => {
  return async (req: AuthenticatedMedusaRequest<User>, res: MedusaResponse, next: Function) => {
    try {
      const userId = req.auth_context?.actor_id;

      if (!userId) {
        return next(
          new MedusaError(MedusaError.Types.UNAUTHORIZED, "User is not authenticated")
        );
      }

      const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

      const { data: users } = await query.graph({
        entity: "user",
        filters: {
          id: userId, // Filtering the query by actor_id
        },
        fields: ["id", "role.*"], // Fetching necessary fields
      });

      if (!users || users.length === 0) {
        return next(new MedusaError(MedusaError.Types.UNAUTHORIZED, "User not found"));
      }

      const user = users[0];

      console.log("User Data:", JSON.stringify(user, null, 2));
      console.log("User ID:", user.id);
      console.log("User Role:", user.role?.name);
      console.log("User Permissions:", user.role?.permissions);

      // Check if the user has a role
      if (!user.role) {
        return next(new MedusaError(MedusaError.Types.NOT_ALLOWED, "User does not have a role"));
      }

      // Retrieve and normalize user permissions
      const userPermissions = Array.isArray(user.role.permissions)
        ? user.role.permissions
            .map((p: string) => p.split(",").map((permission) => permission.trim().toLowerCase()))
            .flat() // Flatten the nested array
        : [];

      console.log("Normalized User Permissions:", userPermissions);

      // Normalize required permissions
      const normalizedRequiredPermissions = requiredPermissions.map((permission) =>
        permission.toLowerCase()
      );

      console.log("Required Permissions:", normalizedRequiredPermissions);

      // Check if the user has all required permissions
      const hasAllRequiredPermissions = normalizedRequiredPermissions.every((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasAllRequiredPermissions) {
        return next(
          new MedusaError(
            MedusaError.Types.UNAUTHORIZED,
            "User does not have the required permissions"
          )
        );
      }

      // Proceed to the next middleware if the user has required permissions
      next();
    } catch (error) {
      console.error("Error in checkPermissions middleware:", error);
      next(
        new MedusaError(
          MedusaError.Types.DB_ERROR,
          "An unexpected error occurred"
        )
      );
    }
  };
};

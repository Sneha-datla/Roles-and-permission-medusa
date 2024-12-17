import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import RoleService from "src/modules/role/service";

interface UpdateRoleRequestBody {
  name?: string;
  permissions?: string[];
}

export async function PUT(req: AuthenticatedMedusaRequest<UpdateRoleRequestBody>, res: MedusaResponse): Promise<void> {
  try {
    // Resolve the RoleService from the request scope
    const roleModuleService: RoleService = req.scope.resolve("roleModuleService");

    // Extract the ID from the request parameters
    const { id } = req.params;

    // Extract data from the request body
    const { name, permissions } = req.body;
    console.log("Request Body:", { name, permissions });

    if (!id) {
       res.status(400).json({ error: "Role ID is required" });
    }

    if (!name && !permissions) {
      res.status(400).json({ error: "At least one field (name or permissions) is required to update" });
    }

    // Update the role using the service
    const updatedRole = await roleModuleService.updateRoles({
      id,
      name,
      permissions,
    });

    console.log("Updated Role:", updatedRole);

    // Send the updated role in the response
    res.status(200).json({ message: "Role updated successfully", updatedRole });
  } catch (error) {
    // Handle errors
    console.error("Error updating role:", error);
    res.status(500).json({ error: "Failed to update the role" });
  }
}

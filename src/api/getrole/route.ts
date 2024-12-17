import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import RoleService from "src/modules/role/service";

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<void> {
  try {
    // Resolve the RoleService from the request scope
    const roleModuleService: RoleService = req.scope.resolve("roleModuleService");

    // Retrieve the list of roles
    const roles = await roleModuleService.listRoles();

    // Send the roles in the response
    res.status(200).json({ roles });
  } catch (error) {
    // Handle errors
    console.error("Error retrieving roles:", error);
    res.status(500).json({ error: "Failed to retrieve roles" });
  }
}

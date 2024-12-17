import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import RoleService from "src/modules/role/service";

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse): Promise<void> {
  try {
    // Resolve the RoleService from the request scope
    const roleModuleService: RoleService = req.scope.resolve("roleModuleService");

    // Extract the ID from the request parameters
    const { id } = req.params;
    console.log(id)

    if (!id) {
       res.status(400).json({ error: "Role ID is required" });
    }

    // Retrieve the role by ID
    console.log("Retrieving role with ID:", id);
    const role = await roleModuleService.retrieveRole(id);
    console.log("Retrieved role:", role);
       

    // Send the role in the response
    res.status(200).json({ role });
  } catch (error) {
    // Handle errors
    console.error("Error retrieving role:", error);
    res.status(500).json({ error: "Failed to retrieve the role" });
  }
}

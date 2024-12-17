import { 
    AuthenticatedMedusaRequest, 
    MedusaResponse 
  } from "@medusajs/framework/http";
  import { MedusaError } from "@medusajs/framework/utils";
  import { z } from "zod";
  import RoleService from "src/modules/role/service"; // Ensure this path is correct
   
  
  // Zod schema definition for creating a role
  const schema = z.object({
    name: z.string(), // Role name is required
    permissions: z.array(z.string()), // Permissions array is required
  }).strict();
  
  type RequestBody = {
    name: string;
    permissions: string[];
  };
  
  export const POST = async (
    req: AuthenticatedMedusaRequest<RequestBody>,
    res: MedusaResponse
  ) => {
    
  
    // Parse and validate the request body using Zod
    const { name, permissions } = schema.parse(req.body);
  
    // Resolve RoleService
    const roleService: RoleService = req.scope.resolve("roleModuleService");
  
    try {
      // Create the role
      const createdRole = await roleService.createRoles({ name, permissions });
  
      // Return the newly created role
      res.status(201).json({
        message: "Role created successfully",
        role: createdRole,
      });
    } catch (error) {
      // Handle any errors that occur during the role creation process
      res.status(400).json({
        message: error instanceof Error ? error.message : "An error occurred while creating the role",
      });
    }
  };
  
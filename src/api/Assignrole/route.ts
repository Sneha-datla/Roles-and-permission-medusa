import { 
    MedusaRequest, 
    MedusaResponse 
  } from "@medusajs/framework/http";
  
  import { 
    ContainerRegistrationKeys, 
    Modules 
  } from "@medusajs/framework/utils";
  
  import { 
    RemoteLink 
  } from "@medusajs/framework/modules-sdk";
  
  // Define the structure of the request body
  interface LinkRequestBody {
    user_id: string;
    role_id: string;
  }
  
  export async function POST(req: MedusaRequest<LinkRequestBody>, res: MedusaResponse): Promise<void> {
    // Resolve the remote link from Medusa's container
    const remoteLink: RemoteLink = req.scope.resolve(
      ContainerRegistrationKeys.REMOTE_LINK
    );
  
    try {
      // Extract user_id and role_id from the request body
      const { user_id, role_id } = req.body;
  
      // Create a link between User and Role Module using the provided IDs
      await remoteLink.create({
        [Modules.USER]: {
          user_id: user_id, // Link user using user_id from the request
        },
        "roleModuleService": {
          role_id: role_id, // Link role using role_id from the request
        },
      });
  
      // Send a success response
      res.status(200).json({ message: "Link created successfully" });
  
    } catch (error) {
      // Handle any errors and send a response
      res.status(500).json({ error: (error as Error).message });
    }
  }
  
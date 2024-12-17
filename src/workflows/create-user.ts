import { 
    createWorkflow, 
    createStep, 
    StepResponse, 
    WorkflowResponse
  } from "@medusajs/framework/workflows-sdk";
  import { setAuthAppMetadataStep } from "@medusajs/medusa/core-flows";
  import { Modules } from "@medusajs/framework/utils";
  import {
    IUserModuleService,
   
  } from "@medusajs/framework/types";
  
  type CreateUserWorkflowInput = {
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
    authIdentityId: string; // The AuthIdentity ID for linking the user
  };
  
  const createUserStep = createStep(
    "create-user-step",
    async ({ user: userData }: Pick<CreateUserWorkflowInput, "user">, { container }) => {
      const userModuleService: IUserModuleService = container.resolve( Modules.USER);
  
      const user = await userModuleService.createUsers(userData); // Create the user
  
      return new StepResponse(user);
    }
  );
  
  const createUserWorkflow = createWorkflow(
    "create-user",
    function (input: CreateUserWorkflowInput) {
      const user = createUserStep({ user: input.user });
  
      setAuthAppMetadataStep({
        authIdentityId: input.authIdentityId,
        actorType: "user",
        value: user.id,
      });
  
      return new WorkflowResponse(user);
    }
  );
  
  export default createUserWorkflow;
  
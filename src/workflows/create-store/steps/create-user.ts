import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { CreateStoreInput } from "..";
import { Modules } from "@medusajs/framework/utils";
import {
  IUserModuleService,
  IAuthModuleService,
  AuthenticationInput,
} from "@medusajs/framework/types";

export const createUserStep = createStep(
  "create-user-step",
  async (input: CreateStoreInput, { container }) => {
    const userService: IUserModuleService = container.resolve(Modules.USER);
    const authService: IAuthModuleService = container.resolve(Modules.AUTH);

    // 1. create user
    const user = await userService.createUsers(input);

    // 2. create auth identity
    const registerResponse = await authService.register("emailpass", {
      body: {
        email: input.email,
        password: input.password,
      },
    } as AuthenticationInput);

    // 3. attach auth identity to user
    const authIdentityId = registerResponse.authIdentity?.id;

    if (!authIdentityId) {
      throw new Error("Authentication identity is missing.");
    }
    
    await authService.updateAuthIdentities({
      id: authIdentityId,
      app_metadata: {
        user_id: user.id,
      },
    });
    

    // 4. do we want to authenticate immediately? 
    //
    // const authenticationResponse = await authService.authenticate("emailpass", {
    //   body: {
    //     email: input.email,
    //     password: input.password,
    //   },
    // } as AuthenticationInput);

    return new StepResponse(
      { user, registerResponse },
      user.id
    );
  },
  async (id: string, { container }) => {
    const userModuleService: IUserModuleService = container.resolve(
      Modules.USER
    );

    await userModuleService.deleteUsers([id]);
  }
);
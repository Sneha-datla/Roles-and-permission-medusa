import {
    createWorkflow,
    when,
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk";
  import { createStoresWorkflow } from "@medusajs/medusa/core-flows";
  
  import { linkUserToStoreStep } from "./steps/link-user-to-store";
  import { createUserStep } from "./steps/create-user"; 
  import { getSalesChannelStep } from "./steps/get-sales-channel"; 
  
  export type CreateStoreInput = {
    store_name: string;
    // first_name: string;
    // last_name: string;
    email: string;
    password: string;
  };
  
  export const createStoreWorkflow = createWorkflow(
    "create-store",
    (input: CreateStoreInput) => {
      const salesChannel = getSalesChannelStep();
  
      const stores = createStoresWorkflow.runAsStep({
        input: {
          stores: [
            {
              name: input.store_name,
              supported_currencies: [{ currency_code: "usd", is_default: true }],
              default_sales_channel_id: salesChannel.id
            },
          ],
        },
      });
  
      const store = stores[0];
  
      const { user, registerResponse } = createUserStep(input);
  
      const userStoreLinkArray = linkUserToStoreStep({ userId: user.id, storeId: store.id });
  
      return new WorkflowResponse({
        store,
        user,
        userStoreLinkArray,
        registerResponse,
      });
    }
  );
import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http"
  import {
    ContainerRegistrationKeys,
  } from "@medusajs/framework/utils"


  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
    const { data: user } = await query.graph({
      entity: "user",
      fields: ["first_name", "last_name","email","role.*","store.name"],
      
    })
    
    res.json({ user: user })
  }
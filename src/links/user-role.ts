import role from "src/modules/role"
import USERModule from "@medusajs/medusa/user"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  USERModule.linkable.user,
  role.linkable.role
)
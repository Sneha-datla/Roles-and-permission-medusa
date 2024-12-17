import RoleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const ROLE_MODULE = "roleModuleService";

export default Module(ROLE_MODULE, {
  service: RoleService,
});

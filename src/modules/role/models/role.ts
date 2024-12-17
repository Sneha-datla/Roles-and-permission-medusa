import { model } from "@medusajs/framework/utils";

const Role = model.define("role", {
  id: model.id().primaryKey(),
  name: model.text(),
  permissions: model.json(), // Array of text values for permissions
});

export default Role;

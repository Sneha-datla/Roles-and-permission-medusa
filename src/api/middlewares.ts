import { defineMiddlewares, authenticate } from "@medusajs/medusa";
import { checkPermissions } from "./middlewares/check-permissions";



export default defineMiddlewares({
  routes: [
    {
      matcher: "/user",
      method: "POST",
      middlewares: [
        authenticate("user", ["session", "bearer"], {
          allowUnregistered: true, // Allow unregistered users for creation
        }),
      ],
    },
    
    {
      matcher: "/user/me*",
      method: "GET",
      middlewares: [
        authenticate("user", ["session", "bearer"]),
      ],
    },

   
    
    {
      matcher: "/admin/products",
      method: "GET",
      middlewares: [
        authenticate("user", ["session", "bearer"]), // Ensure user is authenticated
        checkPermissions(["viewproducts"]), // Only users with "view_products" permission can access
      ],
    },
    {
      matcher: "/admin/products",
      method: "POST",
      middlewares: [
        authenticate("user", ["session", "bearer"]), // Ensure user is authenticated
        checkPermissions(["createproducts"]), // Only users with "view_products" permission can access
      ],
    },
    
    {
      matcher: "/admin/orders",
      method: "GET",
      middlewares: [
        authenticate("user", ["session", "bearer"]), // Ensure user is authenticated
        checkPermissions(["viewOrders"]), // Only users with "view_products" permission can access
      ],
    },
    {
      matcher: "/getrole/:id",
      method: "GET",
      middlewares: [
        authenticate("user", ["session", "bearer"]), // Ensure user is authenticated
      ],
    },
    {
      matcher: "/updaterole/:id",
      method: "PUT",
      middlewares: [
        authenticate("user", ["session", "bearer"]), // Ensure user is authenticated
      ],
    },
   
  ],
});

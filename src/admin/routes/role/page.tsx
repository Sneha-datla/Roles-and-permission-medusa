import { useState } from "react";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import {
  Container,
  Button,
  FocusModal,
  Heading,
  Input,
  Label,
  Switch,
} from "@medusajs/ui";
import { Header } from "../../components/header";
import TableComponent from "./components/table";

type Permissions = {
  viewProducts: boolean;
  editProducts: boolean;
  deleteProducts: boolean;
  createProducts: boolean;
  viewCustomers: boolean;
  editCustomers: boolean;
  deleteCustomers: boolean;
  createCustomers: boolean;
  viewOrders: boolean;
  editOrders: boolean;
  deleteOrders: boolean;
  createOrders: boolean;
};

const CustomPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [roleName, setRoleName] = useState<string>("");
  const [permissions, setPermissions] = useState<Permissions>({
    viewProducts: false,
    editProducts: false,
    deleteProducts: false,
    createProducts: false,
    viewCustomers: false,
    editCustomers: false,
    deleteCustomers: false,
    createCustomers: false,
    viewOrders: false,
    editOrders: false,
    deleteOrders: false,
    createOrders: false,
  });

  // Handlers for opening and closing the modal
  const handleOpenModal = () => setIsModalOpen(true);

  // Handler for toggling permissions
  const handleTogglePermission = (key: keyof Permissions) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handler for saving the role
  const handleSaveRole = async () => {
    const roleData = {
      name: roleName,
      permissions: Object.keys(permissions).filter(
        (key) => permissions[key as keyof Permissions]
      ),
    };

    try {
      const response = await fetch("http://localhost:9000/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleData),
      });
console.log(roleData)
      if (response.ok) {
        alert("Role created successfully!");
        setIsModalOpen(false);
        setRoleName("");
        setPermissions({
          viewProducts: false,
          editProducts: false,
          deleteProducts: false,
          createProducts: false,
          viewCustomers: false,
          editCustomers: false,
          deleteCustomers: false,
          createCustomers: false,
          viewOrders: false,
          editOrders: false,
          deleteOrders: false,
          createOrders: false,
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error: any) {
      alert(`Failed to create role: ${error.message}`);
    }
  };

  return (
    <Container>
      <Header
        title="Roles Widget"
        subtitle="This is my custom Role widget"
        actions={[
          {
            type: "button",
            props: {
              children: "Create New Role",
              variant: "secondary",
              onClick: handleOpenModal,
            },
          },
        ]}
      />
      <TableComponent />
      <FocusModal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <FocusModal.Content>
          <FocusModal.Header>
            <Heading>Create Role</Heading>
            <Button onClick={handleSaveRole}>Save</Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="name" className="text-ui-fg-subtle">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Role Name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-y-8">
                <Label htmlFor="permission" className="text-ui-fg-subtle">
                  Permissions
                </Label>
                <div>
                  <Heading>Products</Heading>
                  <div className="flex flex-wrap gap-x-8 gap-y-4">
                    <div className="flex items-center gap-x-2">
                      <Switch
                        id="viewProducts"
                        checked={permissions.viewProducts}
                        onCheckedChange={() => handleTogglePermission("viewProducts")}
                      />
                      <Label htmlFor="viewProducts">View all Products</Label>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <Switch
                        id="editProducts"
                        checked={permissions.editProducts}
                        onCheckedChange={() => handleTogglePermission("editProducts")}
                      />
                      <Label htmlFor="editProducts">Edit Products</Label>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <Switch
                        id="deleteProducts"
                        checked={permissions.deleteProducts}
                        onCheckedChange={() => handleTogglePermission("deleteProducts")}
                      />
                      <Label htmlFor="deleteProducts">Delete Products</Label>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <Switch
                        id="createProducts"
                        checked={permissions.createProducts}
                        onCheckedChange={() => handleTogglePermission("createProducts")}
                      />
                      <Label htmlFor="createProducts">Create Products</Label>
                    </div>
                  </div>
                </div>
                <div>
                  <Heading>Orders</Heading>
                  <div className="flex flex-wrap gap-x-8 gap-y-4">
                    <div className="flex items-center gap-x-2">
                      <Switch
                        id="viewOrders"
                        checked={permissions.viewOrders}
                        onCheckedChange={() => handleTogglePermission("viewOrders")}
                      />
                      <Label htmlFor="viewOrders">View all Orders</Label>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <Switch
                        id="editOrders"
                        checked={permissions.editOrders}
                        onCheckedChange={() => handleTogglePermission("editOrders")}
                      />
                      <Label htmlFor="editOrders">Edit Orders</Label>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <Switch
                        id="deleteOrders"
                        checked={permissions.deleteOrders}
                        onCheckedChange={() => handleTogglePermission("deleteOrders")}
                      />
                      <Label htmlFor="deleteOrders">Delete Orders</Label>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <Switch
                        id="createOrders"
                        checked={permissions.createOrders}
                        onCheckedChange={() => handleTogglePermission("createOrders")}
                      />
                      <Label htmlFor="createOrders">Create Orders</Label>
                    </div>
                  </div>
                </div>
                {/* Add similar blocks for Customers and Orders */}
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Roles",
  icon: ChatBubbleLeftRight,
});

export default CustomPage;

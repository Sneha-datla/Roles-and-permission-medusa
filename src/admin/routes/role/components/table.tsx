import React, { useState, useEffect } from "react";
import { Table } from "../../../components/table";
import { ActionMenu } from "../../../components/action-menu";
import { Button, Drawer, Input, Label, Switch, Heading } from "@medusajs/ui";
import { Pencil, Trash } from "@medusajs/icons";

interface Role {
  id: number;
  name: string;
  permissions: {
    [key: string]: boolean;
  };
  [key: string]: any;
}

const TableComponent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [data, setData] = useState<Role[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const pageSize = 2;

  // Fetch roles from the API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:9000/getrole");
        const result = await response.json();
        if (response.ok) {
          setData(result.roles);
          setTotalCount(result.totalCount);
        } else {
          console.error("Failed to fetch roles:", result.message);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, [currentPage]);

  // Fetch role details by ID
  const fetchRoleById = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:9000/getrole/${id}`);
      const result = await response.json();
      if (response.ok) {
        // Set only fetched permissions to true, others remain false
        const permissions = result.role.permissions.reduce(
          (acc: { [key: string]: boolean }, permission: string) => {
            acc[permission] = true; // Enable only fetched permissions
            return acc;
          },
          {
            viewProducts: false,
            editProducts: false,
            deleteProducts: false,
            createProducts: false,
            viewOrders: false,
            editOrders: false,
            deleteOrders: false,
            createOrders: false,
          }
        );

        const roleWithPermissions = {
          ...result.role,
          permissions,
        };

        setSelectedRole(roleWithPermissions);
      } else {
        console.error("Failed to fetch role details:", result.message);
      }
    } catch (error) {
      console.error("Error fetching role details:", error);
    }
  };

  // Save the edited role details
  const handleSave = async () => {
    if (selectedRole) {
      try {
        // Only send updated permissions (as a list of permission names) to the backend
        const updatedPermissions = Object.keys(selectedRole.permissions).reduce<string[]>(
          (acc, permission) => {
            if (selectedRole.permissions[permission]) {
              acc.push(permission); // Only include the permission name
            }
            return acc; // Return the accumulator object
          },
          [] // Initialize accumulator as an empty array
        );
  
        const response = await fetch(`http://localhost:9000/updaterole/${selectedRole.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: selectedRole.name,
            permissions: updatedPermissions, // Send only the permission names
          }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          setData((prevData) =>
            prevData.map((role) =>
              role.id === selectedRole.id ? { ...role, ...selectedRole } : role
            )
          );
          setIsDrawerOpen(false);
        } else {
          console.error("Failed to save role:", result.message);
        }
      } catch (error) {
        console.error("Error saving role:", error);
      }
    }
  };
  
  
  
  // Toggle permission
  const handleTogglePermission = (permission: string) => {
    if (selectedRole) {
      setSelectedRole({
        ...selectedRole,
        permissions: {
          ...selectedRole.permissions,
          [permission]: !selectedRole.permissions[permission],
        },
      });
    }
  };

  // Handlers for Edit and Delete actions
  const handleEdit = (role: Role) => {
    fetchRoleById(role.id);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/roles/${id}`, { method: "DELETE" });
      if (response.ok) {
        setData((prevData) => prevData.filter((role) => role.id !== id));
        setTotalCount((prev) => prev - 1);
      } else {
        console.error("Failed to delete role");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const tableData = data.map((role) => ({
    ...role,
    option: (
      <ActionMenu
        groups={[
          {
            actions: [
              {
                icon: <Pencil />,
                label: "Edit",
                onClick: () => handleEdit(role),
              },
              {
                icon: <Trash />,
                label: "Delete",
                onClick: () => handleDelete(role.id),
              },
            ],
          },
        ]}
      />
    ),
  }));

  return (
    <>
      <Table
        columns={[
          { key: "name", label: "Name" },
          { key: "option", label: "Options" },
        ]}
        data={tableData}
        pageSize={pageSize}
        count={totalCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Drawer for editing */}
      {selectedRole && (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <Drawer.Trigger asChild></Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Edit Role</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="p-4">
              <Input
                aria-label="Role Name"
                value={selectedRole.name}
                onChange={(e) =>
                  setSelectedRole({
                    ...selectedRole,
                    name: e.target.value,
                  })
                }
              />
              <div className="flex flex-col gap-y-8">
                <Label htmlFor="permission" className="text-ui-fg-subtle">
                  Permissions
                </Label>
                <div>
                  <Heading>Products</Heading>
                  <div className="flex flex-wrap gap-x-8 gap-y-4">
                    {["viewProducts", "editProducts", "deleteProducts", "createProducts"].map((permission) => (
                      <div className="flex items-center gap-x-2" key={permission}>
                        <Switch
                          id={permission}
                          checked={selectedRole.permissions[permission]}
                          onCheckedChange={() => handleTogglePermission(permission)}
                        />
                        <Label htmlFor={permission}>
                          {permission.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Heading>Orders</Heading>
                  <div className="flex flex-wrap gap-x-8 gap-y-4">
                    {["viewOrders", "editOrders", "deleteOrders", "createOrders"].map((permission) => (
                      <div className="flex items-center gap-x-2" key={permission}>
                        <Switch
                          id={permission}
                          checked={selectedRole.permissions[permission]}
                          onCheckedChange={() => handleTogglePermission(permission)}
                        />
                        <Label htmlFor={permission}>
                          {permission.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
                  Cancel
                </Button>
              </Drawer.Close>
              <Button onClick={handleSave}>Save</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      )}
    </>
  );
};

export default TableComponent;

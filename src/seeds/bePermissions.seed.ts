import { UmPermissionModel } from "@models/beUmPermission.model";

export const addPermissions = () => {
  setTimeout(async () => {
    const arr = [
      {
        name: "dashboard_index",
        displayName: "Dashboard View",
        group: "Dashboard",
      },

      {
        name: "um_departments_index",
        displayName: "Departments View",
        group: "User Management - Departments",
      },
      {
        name: "um_departments_create",
        displayName: "Departments Create",
        group: "User Management - Departments",
      },
      {
        name: "um_departments_update",
        displayName: "Departments Update",
        group: "User Management - Departments",
      },
      {
        name: "um_departments_delete",
        displayName: "Departments Delete",
        group: "User Management - Departments",
      },

      {
        name: "um_teams_index",
        displayName: "Teams View",
        group: "User Management - Teams",
      },
      {
        name: "um_teams_create",
        displayName: "Teams Create",
        group: "User Management - Teams",
      },
      {
        name: "um_teams_update",
        displayName: "Teams Update",
        group: "User Management - Teams",
      },
      {
        name: "um_teams_delete",
        displayName: "Teams Delete",
        group: "User Management - Teams",
      },

      {
        name: "um_roles_index",
        displayName: "Roles View",
        group: "User Management - Roles",
      },
      {
        name: "um_roles_create",
        displayName: "Roles Create",
        group: "User Management - Roles",
      },
      {
        name: "um_roles_update",
        displayName: "Roles Update",
        group: "User Management - Roles",
      },
      {
        name: "um_roles_delete",
        displayName: "Roles Delete",
        group: "User Management - Roles",
      },

      {
        name: "um_roles_permissions_index",
        displayName: "Roles Permissions View",
        group: "User Management - Roles Permissions",
      },
      {
        name: "um_roles_permissions_update",
        displayName: "Roles Permissions Update",
        group: "User Management - Roles Permissions",
      },

      {
        name: "um_users_index",
        displayName: "Users View",
        group: "User Management - Users",
      },
      {
        name: "um_users_create",
        displayName: "Users Create",
        group: "User Management - Users",
      },
      {
        name: "um_users_update",
        displayName: "Users Update",
        group: "User Management - Users",
      },
      {
        name: "um_users_delete",
        displayName: "Users Delete",
        group: "User Management - Users",
      },

      {
        name: "ws_countries_index",
        displayName: "Countries View",
        group: "Web Setup - Countries",
      },
      {
        name: "ws_countries_create",
        displayName: "Countries Create",
        group: "Web Setup - Countries",
      },
      {
        name: "ws_countries_update",
        displayName: "Countries Update",
        group: "Web Setup - Countries",
      },
      {
        name: "ws_countries_delete",
        displayName: "Countries Delete",
        group: "Web Setup - Countries",
      },

      {
        name: "ws_cities_index",
        displayName: "Cities View",
        group: "Web Setup - Cities",
      },
      {
        name: "ws_cities_create",
        displayName: "Cities Create",
        group: "Web Setup - Cities",
      },
      {
        name: "ws_cities_update",
        displayName: "Cities Update",
        group: "Web Setup - Cities",
      },
      {
        name: "ws_cities_delete",
        displayName: "Cities Delete",
        group: "Web Setup - Cities",
      },

      {
        name: "ws_locations_index",
        displayName: "Locations View",
        group: "Web Setup - Locations",
      },
      {
        name: "ws_locations_create",
        displayName: "Locations Create",
        group: "Web Setup - Locations",
      },
      {
        name: "ws_locations_update",
        displayName: "Locations Update",
        group: "Web Setup - Locations",
      },
      {
        name: "ws_locations_delete",
        displayName: "Locations Delete",
        group: "Web Setup - Locations",
      },

      {
        name: "ws_banners_index",
        displayName: "Banners View",
        group: "Web Setup - Banners",
      },
      {
        name: "ws_banners_create",
        displayName: "Banners Create",
        group: "Web Setup - Banners",
      },
      {
        name: "ws_banners_update",
        displayName: "Banners Update",
        group: "Web Setup - Banners",
      },
      {
        name: "ws_banners_delete",
        displayName: "Banners Delete",
        group: "Web Setup - Banners",
      },

      {
        name: "ws_blogs_index",
        displayName: "Blogs View",
        group: "Web Setup - Blogs",
      },
      {
        name: "ws_blogs_create",
        displayName: "Blogs Create",
        group: "Web Setup - Blogs",
      },
      {
        name: "ws_blogs_update",
        displayName: "Blogs Update",
        group: "Web Setup - Blogs",
      },
      {
        name: "ws_blogs_delete",
        displayName: "Blogs Delete",
        group: "Web Setup - Blogs",
      },

      {
        name: "workspace_products_index",
        displayName: "Products View",
        group: "Workspace - Products",
      },
      {
        name: "workspace_products_create",
        displayName: "Products Create",
        group: "Workspace - Products",
      },
      {
        name: "workspace_products_update",
        displayName: "Products Update",
        group: "Workspace - Products",
      },
      {
        name: "workspace_products_delete",
        displayName: "Products Delete",
        group: "Workspace - Products",
      },

      {
        name: "workspace_orders_index",
        displayName: "orders View",
        group: "Workspace - orders",
      },
      {
        name: "workspace_orders_create",
        displayName: "orders Create",
        group: "Workspace - orders",
      },
      {
        name: "workspace_orders_update",
        displayName: "orders Update",
        group: "Workspace - orders",
      },
      {
        name: "workspace_orders_delete",
        displayName: "orders Delete",
        group: "Workspace - orders",
      },
    ];

    console.log(arr);

    await UmPermissionModel.deleteMany({});
    await UmPermissionModel.insertMany(arr, (error: any, docs: any) => {
      if (error) console.log(error);
    });

    console.log("Permissions seeded successfully.");
  }, 1100);
};

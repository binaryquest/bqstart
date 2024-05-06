
import { ViewData, ViewType } from "projects/bq-start-prime/bq-start-module";
import { Injector, createNgModule } from "@angular/core";


export const ADMIN_MODULE_CONFIG = {
  menus: [
    {
      label: "Admin", icon: "pi pi-chart-bar", allowedRoles: [], childMenus: [
        {label: "Admin Component", icon: "pi pi-user-plus", childMenus:[], viewId: "admin-com", },
        {label: "Admin Custom", icon: "pi pi-user-plus", childMenus:[], path:"/admin/manage-users", componentFactory: async (injector: Injector) => {
          const {AdminModule} = await import("./admin.module");
          const moduleRef = createNgModule(AdminModule, injector);
          const lazyComponent = moduleRef.instance.getAdminComponent();
          return lazyComponent;
        }},
      ]
    },
  ],
  views: [
    {
      viewId: "admin-com",
      typeName: "~~admin-com",
      title: "Doctors",
      viewType: ViewType.Custom,
      component: null,
      componentFactory: async (injector: Injector) => {
        const {AdminModule} = await import("./admin.module");
        const moduleRef = createNgModule(AdminModule, injector);
        const lazyComponent = moduleRef.instance.getAdminComponent();
        return lazyComponent;
      }
    }
  ]
}

export const ADMIN_MODULE_ROUTES = [
  { path: "admin", loadChildren: () => import('./admin.module').then(m => m.AdminModule)}
];

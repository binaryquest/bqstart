
import { ViewData, ViewType } from "bq-start-core";
import { Injector, createNgModule } from "@angular/core";
import { ConfirmationService } from "primeng/api";


export const ADMIN_MODULE_CONFIG = {
  menus: [
    {
      label: "Admin", icon: "pi pi-chart-bar", allowedRoles: [], childMenus: [
        {label: "Admin Component", icon: "pi pi-user-plus", childMenus:[], viewId: "admin-com", },
        {label: "Admin Custom", icon: "pi pi-user-plus", childMenus:[], path: "admin/custom", componentFactory: async (injector: Injector) => {
          const {AdminModule} = await import("./admin.module");
          const moduleRef = createNgModule(AdminModule, injector);
          const lazyComponent = moduleRef.instance.getAdminComponent();
          return lazyComponent;
        }},
        {label: "Example List", icon: "pi pi-user-plus", childMenus:[], viewId: "examples-new", },
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
    },
    {
      viewId: "examples-new",
      typeName: "ExampleClass",
      title: "Example new Class",
      viewType: ViewType.List,
      component: null,
      componentFactory: async (injector: Injector) => {
        const {AdminModule} = await import("./admin.module");
        const moduleRef = createNgModule(AdminModule, injector);
        const lazyComponent = moduleRef.instance.getExampleListComponent();
        return lazyComponent;
      }
    },
    {
      viewId: "example-form-new",
      typeName: "ExampleClass",
      title: "Example new Class",
      viewType: ViewType.Form,
      component: null,
      componentFactory: async (injector: Injector) => {
        const {AdminModule} = await import("./admin.module");
        const moduleRef = createNgModule(AdminModule, injector);
        const lazyComponent = moduleRef.instance.getExampleFormComponent();
        return lazyComponent;
      }
    },
  ]
}

export const ADMIN_MODULE_ROUTES = [
  { path: "admin", loadChildren: () => import('./admin.module').then(m => m.AdminModule)}
];

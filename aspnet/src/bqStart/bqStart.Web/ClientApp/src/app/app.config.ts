import { BQConfigData, ViewType } from "projects/bq-start-prime/src/public-api";
import { RoleForm, RoleList } from "./adminUI/roles/roles";
import { DepartmentFormComponent } from "./example/department-form/department-form.component";
import { DepartmentListComponent } from "./example/department-list/department-list.component";
import { ExampleFormComponent } from "./example/example-form/example-form.component";
import { ExampleListComponent } from "./example/example-list/example-list.component";


export const APP_CONFIG: BQConfigData = {
  applicationName: 'bqStart Template',
  logoUrl: 'assets/images/logo.png',
  companyName: 'Binary Quest',
  viewDefaults: { defaultPageSize: 50, otherPageSizes: [25, 50, 100] },
  menus: [
    {
      label: "Home", icon: "",
      childMenus: [
        { label: "Counter", path: "/counter", icon: "", childMenus: [] }
      ]
    },

    {
      label: "Example Menu", icon: "",
      childMenus: [
        { label: "Department", viewId: "departments", icon: "pi-users", childMenus: [] },
        { label: "Classes", viewId: "examples", icon: "pi-users", childMenus: [] },
      ]
    },
    {
      label: "Setup", icon: "", allowedRoles: ["Admin"], childMenus: [
        { label: "Roles", viewId: "roles", icon: "pi-users", childMenus: [] },
      ]
    }
  ],
  views: [
    {
      viewId: "roles",
      typeName: "IdentityRole",
      title: "Roles",
      viewType: ViewType.List,
      component: RoleList
    },
    {
      viewId: "role",
      typeName: "IdentityRole",
      title: "Role",
      viewType: ViewType.Form,
      component: RoleForm
    },
    {
      viewId: "departments",
      typeName: "Department",
      title: "Departments",
      viewType: ViewType.List,
      component: DepartmentListComponent
    },
    {
      viewId: "department-form",
      typeName: "Department",
      title: "Department",
      viewType: ViewType.Form,
      component: DepartmentFormComponent
    },
    {
      viewId: "examples",
      typeName: "ExampleClass",
      title: "Departments",
      viewType: ViewType.List,
      component: ExampleListComponent
    },
    {
      viewId: "example-form",
      typeName: "ExampleClass",
      title: "Department",
      viewType: ViewType.Form,
      component: ExampleFormComponent
    },
  ]
}

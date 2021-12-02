import { BQConfigData, ViewType } from "projects/bq-start-prime/src/public-api";


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

      ]
    },
    {
      label: "Setup", icon: "", allowedRoles: ["Admin"], childMenus: [

      ]
    }
  ],
  views: [

  ]
}

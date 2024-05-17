const routers = [
  { path: "/", redirect: "/bag" },
  {
    path: "/bag",
    component: () => import("@/bag/main.vue"),
  },
  {
    path: "/admin",
    component: () => import("@/admin/main.vue"),
  }
];
export default routers;

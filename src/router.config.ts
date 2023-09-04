const routers = [
  { path: "/", redirect: "/home" },
  {
    path: "/auth",
    component: () => import("@/auth/frame.vue"),
    meta: { requireAuth: false },
  },
  {
    path: "/reset_password/:email/:token",
    component: () => import("@/auth/reset.vue"),
    meta: { requireAuth: false },
  },
  {
    path: "/home",
    component: () => import("@/mainpage/frame.vue"),
    meta: { requireAuth: true },
  },
];
export default routers;

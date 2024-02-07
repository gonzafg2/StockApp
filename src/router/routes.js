const routes = [
  { path: "/", redirect: "/stock" },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/stock", component: () => import("pages/Index.vue") },
      { path: "/input", component: () => import("components/Input.vue") },
      { path: "/output", component: () => import("components/Output.vue") },
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;

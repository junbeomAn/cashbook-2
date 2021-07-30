/**
 * router
 *   .addRoute('/', component1)
 *   .addRoute('/main', component2, loginCheckMiddleWare)
 *   .addRoute('/calendar', component3, loginCheckMiddleWare)
 *   .setNotFound(404PageRender)
 *   .start()
 *
 */

const initRouter = () => {
  const routes = [];
  let notFound = () => {};
  let lastPathname;

  const router = {};

  const checkRoutes = () => {
    const { pathname } = window.location;
    if (lastPathname === pathname) {
      return;
    }
    lastPathname = pathname;

    const currentRoute = routes.find((route) => route.url === pathname);

    if (!currentRoute) {
      notFound();
      return;
    }
    if (currentRoute.middleware && currentRoute.middleware() === false) return;

    new currentRoute.component();
  };

  router.addRoute = (url, component, middleware) => {
    routes.push({
      url,
      component,
      middleware,
    });

    return router;
  };

  router.setNotFound = (cb) => {
    notFound = cb;
    return router;
  };

  router.push = (path, state = {}) => {
    const { pathname } = window.location;
    if (path === pathname) {
      return;
    }
    const pushEvent = new CustomEvent('push', { bubbles: true });
    window.history.pushState(state, '', path);
    document.dispatchEvent(pushEvent);
  };

  router.start = () => {
    document.addEventListener('push', checkRoutes);
    return router;
  };

  return router;
};
export default initRouter();

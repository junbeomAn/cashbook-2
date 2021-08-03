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

    let currentRoute;
    if (process.env.NODE_ENV === 'development') {
      currentRoute = routes.find((route) => route.url === pathname);
    } else {
      currentRoute = routes.find(
        (route) => route.url === `/${pathname.split('/')[2]}`
      );
    }

    if (!currentRoute) {
      notFound();
      return;
    }
    if (currentRoute.middleware && currentRoute.middleware() === false) return;

    new currentRoute.component(currentRoute.defaultProps);
  };

  router.addRoute = (url, component, defaultProps, middleware) => {
    routes.push({
      url,
      component,
      middleware,
      defaultProps,
    });
    return router;
  };

  router.setNotFound = (cb) => {
    notFound = cb;
    return router;
  };

  router.push = (path, back = false, state = {}) => {
    const { pathname } = window.location;
    if (path === pathname) {
      return;
    }
    const pushEvent = new CustomEvent('push', { bubbles: true });
    if (back) {
      window.history.replaceState({ ...state, path }, '', path);
    } else {
      window.history.pushState({ ...state, path }, '', path);
    }
    document.dispatchEvent(pushEvent);
  };

  router.start = () => {
    window.addEventListener('push', checkRoutes);
    window.addEventListener('popstate', (e) => {
      router.push(e.state.path, true);
    });
    return router;
  };

  return router;
};
export default initRouter();

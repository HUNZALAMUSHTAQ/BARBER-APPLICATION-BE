const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const reviewRoute = require('./review.route');
const planRoute = require('./plan.route');
const productRoute = require('./product.route');
const serviceRoute = require('./service.route');
const bookingRoute = require('./booking.route');
const operationsRoute = require('./operatinghours.route');

const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/reviews',
    route: reviewRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/operations',
    route: operationsRoute,
  },
  {
    path: '/plan',
    route: planRoute
  },
  {
    path: '/services',
    route: serviceRoute
  },
  {
    path: '/booking',
    route: bookingRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;

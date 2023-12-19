const express = require('express');
const routeBusiness = require('./routesBusiness');
const routeApartados = require('./routesApartados');
const routesAdmin = require('./routesAdmin');
const routeSession = require('./routesSession');
const routesNews = require('./routesNews');
const routesOpeningHours = require('./routesOpeningHours');
const routesProducts = require('./routesProducts');
const routesPromotion = require('./routesPromotion');
const routesSocialNetworks = require('./routesSocialNetworks');
const routesImages = require('./routesImages');

function router(app) {
  const routes = express.Router();
  app.use('/api/v1', routes);
  routes.use('/business', routeBusiness);
  routes.use('/sections', routeApartados);
  routes.use('/admin', routesAdmin);
  routes.use('/sessions', routeSession);
  routes.use('/news', routesNews);
  routes.use('/openingHours', routesOpeningHours);
  routes.use('/products', routesProducts);
  routes.use('/promotions', routesPromotion);
  routes.use('/socialNetworks', routesSocialNetworks);
  routes.use('/images', routesImages);

}

module.exports = router;

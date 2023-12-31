const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const { config } = require('./config/config');
const port = config.port;
const router = require('./routes');
const createBusiness = require('./schemas/businessSchema');
const createNews = require('./schemas/newsSchema');
const createAdmin = require('./schemas/adminSchema');

const path = require('path');
const passport = require('passport');

app.set('trust proxy', true);

require('./middlewares/passportConfig')

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(cors({ credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
router(app);

createBusiness();
createNews();
createAdmin();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  if (req.hostname === 'api.potosymasquehistoria.com') {
    res.send('¡Hola desde el subdominio api.potosymasquehistoria.com!');
  } else {
    next();
  }
});

server.listen(port, () => {
  console.log(process.env.PORT);
  console.log(`mi port ${port}`);
});

module.exports = io;
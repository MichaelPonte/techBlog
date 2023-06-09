const path = require('path');
const express = require('express');
const session = require('express-session');
const expHandlebars = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001;

const routes = require('./controllers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const helpers = require('./utils/helpers');

const sessInit = {
    secret: 'Secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sessInit));

const hbs = expHandlebars.create({ helpers });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
    sequelize.sync({force: false});
});
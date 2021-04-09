const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
var bodyParser = require('body-parser')
var admin = require("firebase-admin");

require('dotenv').config();

// set router files
const indexRouter = require('./routes/index');
// const cvRouter = require('./routes/calcview.route');
// const gamesRouter = require('./routes/games.route');
// const hanaRouter = require('./routes/hana.route');

const app = express();
console.log("SERVER PORT:", process.env.SERVER_PORT);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use(express.urlencoded({ limit: '10MB', extended: true }));
// app.use(express.json({ limit: '10MB' }));
// app.use(bodyParser.urlencoded({ extended: false }));


var serviceAccount = require("./config/home-f65a9-firebase-adminsdk-sjzuh-dfad38ba19.json")

admin.initializeApp({
  // credential: admin.credential.applicationDefault(),
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://home-f65a9.firebaseio.com"
});

function loggedIn(req, res, next) {
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV !== 'development') {
    admin.auth().verifyIdToken(req.headers.token)
      .then(decodedToken => {
        return decodedToken.uid;
      })
      .then(uid => {
        return admin.auth().getUser(uid)
      })
      .then(userRecord => {
        const claim = req.headers.claim
        if (userRecord.customClaims && userRecord.customClaims[`${claim}`]) {
          // console.log(`userRecord${claim}:`, userRecord.customClaims[`${claim}`]);
          next();
        } else {
          throw new Error('401 Unauthorized');
        }
      })
      .catch(error => {
        next(error);
      })
  } else {
    next();
  }
}

app.use(loggedIn);

// set routes based on previous routers set
app.use('/', indexRouter);
// app.use('/api/cv', cvRouter);
// app.use('/api/games', gamesRouter);

// catch 404 and forward to error handler
// app.use((req, res, next) => {
//   next(createError(404));
// });

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

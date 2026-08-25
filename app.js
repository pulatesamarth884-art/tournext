const express = require('express');
const app = express();
const path = require('path');

const globalErrorHandler = require('./controllers/errorController.js');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
var cookieParser = require('cookie-parser');

const userRoute = require('./routes/userRoute.js');
const tourRoute = require('./routes/tourRoute.js');
const viewRoute = require('./routes/viewRoute.js');
const reviewRoute = require('./routes/reviewRoute.js');


// app.use(express.json()); 
// app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'public', 'views'));

// use helmet to prevent against clickjacking, MIME sniffing, and some XSS attacks
app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
        ],
         "connect-src": ["'self'", "https://cdnjs.cloudflare.com"]
      },
    },
    xDownloadOptions: false
  }
));

//use for brute-force attacks
const limit = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "To many req from this api! Try again leter..."
});


app.use('/api', limit);
app.use(express.json({limit: '10kb'}));
app.use(cookieParser());

app.use((req,res,next) => {
  //console.log(req.cookies);

  next();
});

// prevent from noSql querry attack
app.use(mongoSanitize());

// prevent from XSS attack
app.use(xss());


// body parse  
app.use('/api/v1/users', userRoute);
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/', viewRoute);

app.use(globalErrorHandler);

module.exports = app;
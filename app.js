require('dotenv').config();
require('express-async-errors');


// Security packages 

const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const express = require('express');
const app = express();

//connectDB
const authenticateUser = require ('./middleware/authentication')

const connectDB = require('./db/connect')

//routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1); // use this line of code if the app is behnd reverse proxy (which is true in our case since we are going to use heroku)  
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, //15 mins   
  max: 100, // limit each ip to 100 requests per windowMs

})) // use alt + up arrow to move line up 

app.use(express.json())

app.use(helmet())
app.use(cors())
app.use(xss())

// extra packages


// routes
//app.get('/', (req, res) => {
//  res.send('jobs api');
//});
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser,jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGOURI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

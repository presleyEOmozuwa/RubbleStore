require('dotenv').config()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const express = require('express')
const mainConnect = require('./dbConnect')
const session = require('express-session')
const MongoStore = require('connect-mongo')

const adminRouter = require('./controllers/Admin/admin-controller')
const accountSettingRouter = require('./controllers/AccountSettings/account-setting-controller')
const accountUpdateRouter = require('./controllers/AccountUpdate/account-update-controller')
const userRouter = require('./controllers/AppUser/appuser-controller')
const registerRouter = require('./controllers/Register/register-controller')
const loginRouter = require('./controllers/Login/login-controller')
const cartRouter = require('./controllers/Cart_AuthUser/cart-controller')
const unregisteredUserCartRouter = require('./controllers/Cart_UnregisteredUser/unregistered-user-cart-controller')
const orderRouter = require('./controllers/Order/order-controller')
const orderArchiveRouter = require('./controllers/Order_Archive/order-archive-controller')
const productRouter = require('./controllers/Product/product-controller')
const categoryRouter = require('./controllers/Category/category-controller')
const subCartRouter = require('./controllers/Cart_Subscription_Items/subcart-controller')
const stripeRouter = require('./controllers/Stripe/stripe-controller')
const subscriptionRouter = require('./controllers/Subscription/subscription-controller')
const subArchiveRouter = require('./controllers/Subscription_Archive/sub-archive-controller')

const app = express()
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // max 100 requests per windowMs
// });

// GLOBAL ROUTES AND MIDDLEWARE
// app.use(limiter);
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// DATABASE CONNECTION
mainConnect()

// Configure session middleware
const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY
const mongoUrl = process.env.MONGODB_ATLAS_URL

app.use(
  session({
    secret: SESSION_SECRET_KEY,
    store: MongoStore.create({ mongoUrl, ttl: 30 * 24 * 60 * 60 * 1000, autoRemove: 'native' }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      // if true only transmit cookie over https
      sameSite: 'strict',
      httpOnly: true, // if true prevent client side JS from reading the cookie
      // maxAge: 1000 * 60 * 10, // session max age in milliseconds
      maxAge: 30 * 24 * 60 * 60 * 1000
    }
  })
)
// app.use(csrf());

app.use(unregisteredUserCartRouter)
app.use(registerRouter)
app.use(loginRouter)
app.use(userRouter)
app.use(adminRouter)
app.use(accountSettingRouter)
app.use(accountUpdateRouter)
app.use(cartRouter)
app.use(productRouter)
app.use(categoryRouter)
app.use(orderRouter)
app.use(orderArchiveRouter)
app.use(stripeRouter)
app.use(subCartRouter)
app.use(subscriptionRouter)
app.use(subArchiveRouter)

// PORT
const PORT = process.env.PORT || 5000

// Starting the Server
app.listen(PORT, () => {
  console.log(`Dev Server is listening on port ${PORT}`)
})

const express = require('express');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const session = require('express-session');
const MongoDBStore = require( 'connect-mongodb-session' )( session );
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const router = require('./router/auth');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer');
const User = require( './models/user' );
const PORT = process.env.PORT || 5000;
dotenv.config();
const app = express();

const store = new MongoDBStore( {   
    uri: 'mongodb+srv://lifegoeson:lifegoeson@cluster0.tvipf.mongodb.net/webapp?retryWrites=true&w=majority',
    collection: 'sessions'
} );

app.use(cors());
app.use(cookieParser());
app.use(express.json());


// upload file img and convert path to static in project
const fileStorage = multer.diskStorage( {
    destination: ( req, file, cb ) => {
        cb( null, './images' );
    },

    filename: ( req, file, cb ) => {
        cb( null, Date.now() + '--' + file.originalname );
    }
} );

const fileFilter = ( req, file, cb ) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb( null, true );
    } else {
        cb( null, false );
    }
};

app.set( 'view engine', 'ejs' );
app.set( 'views', 'views' );

app.use( bodyParser.urlencoded( { extended: false } ) );

app.use(
    multer( { storage: fileStorage, fileFilter: fileFilter } ).single( 'emoji' )
);

app.use( '/images', express.static( path.join( __dirname, 'images' ) ) );

app.use(
    session( {
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    } )
);


app.use( ( req, res, next ) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
} );


app.use( async ( req, res, next ) => {

    if ( !req.session.user ) {
        return next();
    }
    try {     
        const userDetail =await User.findById( req.session.user._id );
        if( !userDetail ) {
            return next();
        }
        req.user =userDetail;
        next()
    } catch ( error ) {
        console.log( error )
    }

} );


// ROUTER
app.use(router);


// CONNECT DATABASE

mongoose
    .connect('mongodb+srv://lifegoeson:lifegoeson@cluster0.tvipf.mongodb.net/webapp?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((result) => {
        app.listen(PORT);
        console.log(`http://localhost:${PORT}`);
    })
    .catch((err) => {
        console.log(err);
    });


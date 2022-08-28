const express = require("express");
const session = require("express-session");
const data = require("./data")
const passport = require("passport");
const passportlocal = require("passport-local");

const app = express();


const LocalStrategy = new passportlocal.Strategy(
    {
        usernameField: "email",
    },
    (email, password, done) => {
        const user = data.users.find((user) => user.email === email);
        if(!user){
            return done(null, false);
        }
        else{
            if(user.password !== password){
                return done(null,false);
            }
            else{
                return done(null, user.email);
            }
        }
    }
);

passport.use(LocalStrategy);

passport.serializeUser(function(user,done){
    done(null,user)
});

passport.deserializeUser(function(email,done){
    done(null,email)
});

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(
    session({
        secret: "1qaz2wsx",
        cookie: {
            maxAge: 60*60*1000,
        },
        saveUninitialized:true,
        resave:false,
    })
)

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended: true}))

app.use("/public",express.static('public'))

app.get("/",(req, res)=>{
    if(!req.session.pageVisitCount){
        req.session.pageVisitCount=1;
    }
    else{
        req.session.pageVisitCount = req.session.pageVisitCount + 1;
    }
    res.render("index",{
        count: req.session.pageVisitCount,
    });
});

app.get("/login",(req,res) => {
    res.render("login");
});

app.post(
    "/login",
    passport.authenticate("local",{
        failureRedirect: "/login",
        successRedirect: "/",
    }),
    (req,res)=> {}
);

const P =3000;
app.listen(P,()=>{
    console.log(`Server listening to port ${P}\nhttp://localhost:${P}/login`);
});
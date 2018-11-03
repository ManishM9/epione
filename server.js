var express = require("express");
var app = express();
var session = require("express-session");
var bodyparser = require("body-parser");
// var nodecalendar = require("node-calendar");
var path = require("path");
var mongoose = require("mongoose");
// var nodemailer = require("nodemailer");
var fs = require("fs");
var multer = require("multer");
// const ngUniversal = require('@nguniversal/express-engine');
// const appServer = require('/dist');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use(session({
    secret: 'mAtlAB meRa LaWDa',
    resave: false,
    saveUninitialized: true,
    username: undefined,
    clearance: '',
    name: '',
}));

app.use(express.static(path.join(__dirname, 'dist/epione')));
app.use('/glint', express.static(path.join(__dirname, 'glint')));
app.use('/Login_v8', express.static(path.join(__dirname, 'Login_v8')));
app.use(express.static(path.join(__dirname, 'IMAGESFROMRPI')));

const upload = multer({
    dest: "TempImagesFromRpi"
});

var url = "mongodb://admin:admin69@ds131743.mlab.com:31743/micro";
mongoose.connect(url, {useNewUrlParser: true});
var conn = mongoose.connection;
conn.on('error', () => {
	console.log("Error Connecting to mlab");
});
conn.on('open', () => {
	console.log("Connetion established to mlab");
});

var loginSchema = new mongoose.Schema({
    username: String,
    password: String,
});

var Login = mongoose.model("login", loginSchema);

var valuesSchema = new mongoose.Schema({
    locator: Number,
    avgsteps: Number,
    avgbpm: Number,
    breathrate: Number,
    fit: Number
});

var Values = mongoose.model("values", valuesSchema);

// Values.create({ locator: 1, avgsteps: 2535, avgbpm: 73, breathrate: 40, fit: 61 }, (err, value) => {
//     if(err){
//         console.log(err);
//         throw err;
//     } else {
//         console.log(value);
//     }
// });

// Login.create({ username: "epione", password: "epione" }, (err, login) => {
//     if(err){
//         console.log(err);
//         throw err;
//     } else {
//         console.log(login);
//     }
// })




// function getImageName() {
//     fs.readdirSync(path.join(__dirname, "/IMAGESFROMRPI"), (err, files) => {
//         if(err){
//             console.log("Unable to scan Directory");
//             return "image1";
//         } else {
//             var len = files.length;
//             var name_tosend = "image"+String(len+1);
//             return name_tosend;
//         }
//     });
// }

app.post("/imagelen", (req, res) => {
    if(req.body.sendlen){
        fs.readdir(path.join(__dirname, "/IMAGESFROMRPI"), (err, files) => {
            if(err) {
                console.log(err);
                res.send("Error");
            } else {
                res.send({ len:files.length });
            }
        });
    }
});

app.post("/image", upload.single("file"), (req, res) => {
    console.log(req.file);
    console.log(req.body);
    const tempPath = req.file.path;

    fs.readdir(path.join(__dirname, "/IMAGESFROMRPI"), (err, files) => {
        image_tosend = "";
        if(err){
            console.log("Unable to scan Directory");
            image_tosend = "image1";
        } else {
            var len = files.length;
            image_tosend = `image${len+1}`;
        }

        const targetPath = path.join(__dirname, "/IMAGESFROMRPI/"+image_tosend+".png");

        if(path.extname(req.file.originalname).toLowerCase() === ".png"){
            fs.rename(tempPath, targetPath, err1 => {
                if(err1){
                    console.log("Error1");
                    console.log(err1);
                    res.send("Fail1!!!!");
                } else {
                    res.send("Success");
                    fs.unlink(tempPath, err2 => {
                        if(err2){
                            console.log("Error unlinking");
                        } else {
                            console.log("Erased file after storing it");
                        }
                    })
                }
            });
        } else {
            fs.unlink(tempPath, err1 => {
                if(err1){
                    console.log("Error2");
                    console.log(err1);
                    res.send("Fail2!!!!");
                } else {
                    res.send("Only send .png files");
                }
            });
        }


    });

});

// fs.readdir(path.join(__dirname, "IMAGESFROMRPI"), (err, files) => {
//     if(err){
//         console.log("Unable to scan Directory");
//     } else {
//         files.forEach(file => {
//             console.log(file);
//         });
//     }
// });


app.post("/login", (req, res) => {
    var reqb = req.body;
    console.log(reqb);
    var username = reqb.username;
    var password = reqb.password;
    Login.find({ username: username, password: password }, (err, login) => {
        if(err){
            console.log(err);
            res.send(false);
            throw err;
        } else {
            console.log(login);
            login = login[0];
            if(login !== {} && login !== undefined && login !== null){
                req.session.username = username;
                res.send(true);
            } else {
                res.send(false);
            }
        }
    });
});


app.post("/uploadfit", (req, res) => {
    var reqb = req.body;
    console.log(reqb);
    var obj_toadd = {
        locator: 1,
        avgsteps: Number(reqb.avgsteps),
        avgbpm: Number(reqb.avgbpm),
        breathrate: Number(reqb.breathrate),
        fit: Number(reqb.fit)
    };
    console.log(obj_toadd);
    Values.deleteMany({}, (err, info)=> {
        if(err){
            console.log(err);
            throw err;
        } else {
            Values.create({obj_toadd}, (err2, value) => {
                if(err2){
                    console.log(err2);
                    res.send("Fail");
                    throw err2;
                } else {
                    console.log(value);
                    res.send("Success");
                }
            });
        }
    });
});

app.get("/getfit", (req, res) => {
    if(req.session.username !== null && req.session.username !== undefined){
        Values.find({ locator:1 }, (err, value) => {
            if(err){
                console.log(err);
                res.send(false);
                throw err;
            } else {
                value = value[0];
                console.log(value);
                res.send({ avgsteps: value.avgsteps, avgbpm: value.avgbpm, breathrate: value.breathrate, fit: value.fit });
            }
        });
    }
});

// function angularRouter(req, res) {

//   /* Server-side rendering */
//   res.render('index', { req, res });

// }

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname,"dist/epione/index.html"));
});

app.get("/", (req, res)=> {
    if(req.session.username != undefined){
        res.sendFile(path.join(__dirname,"dist/epione/index.html"));
    } else {
        res.redirect("/login");
    }
});

app.get("/getlogin", (req, res) => {
    if(req.session.username !== undefined){
        res.send(true);
    } else {
        res.send(false);
    }
})

// app.engine('html', ngUniversal.ngExpressEngine({
//   bootstrap: appServer.AppServerModuleNgFactory
// }));
// app.set('view engine', 'html');
// app.set('views', 'dist');

// /* Direct all routes to index.html, where Angular will take care of routing */
// app.get('*', angularRouter);


app.listen(process.env.PORT || 8888, process.env.IP, () => {
    console.log("Server Started");
});
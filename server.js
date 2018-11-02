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






app.get("/test", (req, res) => {
    res.send("Yo");
});


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





app.listen(process.env.PORT || 8888, process.env.IP, () => {
    console.log("Server Started");
});
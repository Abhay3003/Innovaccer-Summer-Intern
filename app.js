
var express = require("express");
var app =express();
var mongoose = require("mongoose");
var bodyParser=require("body-parser");
var nodemailer=require("nodemailer");
const accountSid = '';                           //Enter your accountSid from Twilio
const authToken = '';                           //Enter your authToken from Twilio
const client = require('twilio')(accountSid, authToken);
var details;
mongoose.connect("mongodb://localhost/entries", {useUnifiedTopology: true, useNewUrlParser: true});     //connecting to databse 'entries'
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
mongoose.set('useFindAndModify', false);

var transporter = nodemailer.createTransport({
    service: 'gmail',                                                  //Domain name like yahoo or gmail
    secure: false,
    disableFileAccess: false,
    port: 25,
    auth: {
      user: '',                                            //Enter your email address (turn off less secure apps settings)
      pass: ''                                            //Enter the password for email id 
    },
    tls: {
        rejectUnauthorized: false
    }
});

var visSchema = new mongoose.Schema({                                //Creating Schema or Database
    vname: String,
    vemail: String,
    vphone: Number,
    hname: String,
    hemail: String,
    hphone: Number,
    cintime: String,
    address: String,
    coutime: String,
});

var visitors = mongoose.model("visitors",visSchema);

app.get("/",function(req,res){
    res.render("start.ejs");                                        //Start screen or Homepage
});

app.get("/go",function(req,res){
    res.render("out.ejs");                                          //Directed to Check out form 
});

app.post("/back",function(req,res){                                //Processing information from check out form
   
   var caddress = req.body.address;
   var phone = req.body.outphone;
    if(phone.length != 10)                                          //Checking length of phone number
    {
        console.log("Invalid mobile number!!!");
        res.redirect("/");                                          //directs to start screen or home page
    }
    else{
        visitors.find({vphone : phone}, function(err,doc){           //phone number is used as primary key and search is performed through phone no.
            var n1 = doc.length;
            if(err)
            {
                console.log(err);
                res.redirect("/");

            }
            else{
                if(doc[0]===undefined)                           //Phone number is not found then visitor is not in database
                {
                    console.log("User not found!!!");
                    res.redirect("/");
                }
                else if(doc[n1-1].coutime !== undefined){             //Checking whether visitor already checked out or not (last entry)
                    console.log("Visitor already checked out!!");
                    res.redirect("/");
                }
                else if(doc[n1-1].coutime === undefined && doc[n1-1].address === undefined){       //Visitor checking out function
                    var currentdate = new Date();
                    var checkouttime = currentdate.getDay() + "/" + currentdate.getMonth() 
                                        + "/" + currentdate.getFullYear() + " @ " 
                                        + currentdate.getHours() + ":" 
                                        + currentdate.getMinutes() + ":" + currentdate.getSeconds();
                    var mailOptions = {                                                                //sending mail to visitor
                        from: 'entrymgmt@gmail.com',
                        to:  doc[n1-1].vemail,
                        subject: 'Checkout Details',
                        text: "VISITOR NAME: " +doc[n1-1].vname + "\nVISITOR PHONE: " + doc[n1-1].vphone + "\nCHECKIN TIME: "+ doc[n1-1].cintime +"\nCHECKOUT TIME: "+ checkouttime + "\nHOST NAME: "+ doc[n1-1].hname +  "\nADDRESS VISITED: " + caddress +"\nThanks for the visit" 
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                        console.log(error);
                        } else {
                        console.log('Email sent: ' + info.response);
                        }
                    });

                    visitors.findOneAndUpdate({vphone: phone, coutime: undefined, address: undefined}, {$set:{address : caddress, coutime: checkouttime}}, {new: true}, (err, doc) => {
                        if (err) {
                            console.log("Something wrong when updating data!");
                        }                                                                   //checkout time and address is added to database corresponding to the entry 
                        
                    });
                    res.redirect("/");                                        //after whole checking out process, directed to home screen
                }
            }
        });
    }
});

app.get("/submit",function(req,res){                              //directs to check in form 
    res.render("form.ejs");
});

app.post("/",function(req,res){                                     //processing information from check in form 

    var visname = req.body.visname;
    var visemail = req.body.visemail;
    var visphone = req.body.visphone;
    var hosname = req.body.hosname;
    var hosemail = req.body.hosemail;
    var hosphone = req.body.hosphone;
    var currentdate = new Date();
    var checkintime = currentdate.getDay() + "/" + currentdate.getMonth() 
                        + "/" + currentdate.getFullYear() + " @ " 
                        + currentdate.getHours() + ":" 
                        + currentdate.getMinutes() + ":" + currentdate.getSeconds();

    visitors.find({vphone : visphone}, function(err,doc){                   //finding visitor using mobile number
        var n = doc.length;
        if(err)
        {
            console.log(err);
            res.redirect("/");

        }
        else if((doc[n-1]===undefined || doc[n-1].coutime !== undefined)){
            if(visphone.length !=10 || hosphone.length != 10)                 //checking length of mobile numbers
            {
                console.log("Invalid mobile number!!");
                res.redirect("/submit");
            }
            else
            {
                details = {vname: visname, vemail: visemail, vphone: visphone, hname: hosname, hemail: hosemail, hphone: hosphone, cintime: checkintime};
                visitors.create(details,function(err,newDetails){                    //adding visitor details to database
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        var mailOptions = {                                           //mail to host email
                            from: 'entrymgmt@gmail.com',
                            to: details.hemail,
                            subject: 'CHECKED IN',
                            text: "VISITOR NAME: " + visname + "\nVISITOR EMAIL: " + visemail + "\nVISITOR PHONE " + visphone + " \nHere to visit you"
                        };
        
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                            console.log(error);
                            } else {
                            console.log('Email sent: ' + info.response);
                            }
                        });
        
                        client.messages                                                  //mail to host phone number
                            .create({
                                        body: "VISITOR NAME: " + visname + "\nVISITOR EMAIL: " + visemail + "\nVISITOR PHONE " + visphone + " \nHere to visit you",
                                        from: '',                           //Enter the number you got from Twilio
                                        to: "+91" + hosphone
                                    })
                            .then(message => console.log(message.sid)); 
                        
                        res.redirect("/");
                    }
                });
            }
        }
        else{
            console.log("Cannot check in. User is already checked in");                 //if user already checked in
            res.redirect("/");
        }
    });
});

app.listen(3000,function(){
    console.log("Server has started!!!");                        //Start of server message
});


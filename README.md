# Innovaccer-Summer-Intern
Summer Internship Hiring Assignment-Innovaccer.

## Prerequisites

All The scripts and files have been tested on **Windows 10 version 1903 (OS Build 18362.476)**.
Mail is sent to the host and visitor using **Nodemailer** and version used is **6.3.1**. Messages are sent to the host using **Twilio** version **3.37.1**. Database used is **MongoDB** version **4.2.1**.

Stack used **MongoDB-Express-NodeJS**.
For front end : **HTML, CSS, EJS**.
Used **Bootstrap version 4.3.1**.  



## Why MongoDB ? 

MongoDB is Object-Oriented, simple, dynamic and scalable NoSQL database. It is based on the NoSQL document store model, in which data objects are stored as separate documents inside a collection instead of storing the data into columns and rows of a traditional relational database. The motivation of MongoDB is to implement a data store that provides high performance, high availability, and automatic scaling. MongoDB is an extremely simple and easy  to implement. The core of MongoDB storage is documents and it’s stored as  JSON or Binary JSON objects.


## Why Nodemailer ? 

Nodemailer is an easy to use module to send e-mails with Node.JS (using SMTP or sendmail or Amazon SES) and is unicode friendly - You can use any characters you like. 

Nodemailer is Windows friendly, you can install it with npm on Windows just like any other module, there are no compiled dependencies.

It supports HTML content as well as plain text content. It also supports embedded imanges in HTML.

## Why Twilio ? 

Twilio is a cloud based service that enables powerful communication between mobile devices, applications, services, and systems throughout the business in order to bridge the gap between conventional communication.

Twilio seeks to rid businesses of the messy telecom hardware by providing a telephony infrastructure web service via a globally available cloud API, allowing web developers to use standard web languages to integrate phone calls, text messages and IP voice communications into their web, mobile and traditional phone applications.



## How the application works ? 

Home page or Home Screen of the application has two buttons, one for **CHECK-IN** and other for **CHECK-OUT** 

Home page image:

#### **DATABASE NAME: entries. Collections: visitors**

```
FIELDS:

* visitor name
* visitor email
* visitor phone number 
* host name 
* host email
* host phone number
* check-in time
* check-out time
* address visited
```


### Check-In working

If a visitor wants to check in then the company employee clicks the check in button and a form opens up 

Check in form image:

#### **Here phone number of visitor is used as primary key**

Condition is checked whether phone numbers are of length 10 digits. If not, we are redirected to check in form page. All the fields are required before submitting the form.

When all the fields are filled and form is submitted we are redirected to home screen and data is stored in our database. Email is sent to host email and message is sent to host phone number.

Email : 

Message : 

Database : 

If the visitor did not check out and his/her information is entered in check in form then a message is displayed on terminal window **"Cannot check in. User is already checked in"**.

Form with same visitor details: 

Message displayed corresponding to above image: 

If a visitor checked out then he can again check in. 
Image:

### Check-Out working

When **check-out** button is clicked we are redirected to a form where the input fields are visitor's phone number and address where visitor visited. After the form is submitted, a mail is sent to visitor's email address. 

Email :

Address and check out time is added to database corresponding to the entry. 

Database: 

**"User not found!!!"** message is displayed if no entry corresponds to entered mobile number of visitor. 

Image: 

If the last entry of a particular visitor has checkout time and again the check out form is submitted with details of above mentioned visitor then **"Visitor already checked out!!"** message is displayed on the terminal. 

### Dependencies 


```
1) express
2) ejs
3) body-parser
4) mongoose
5) nodemailer
6) twilio

```

### Setup on local system


1) Install Mongo DB (https://www.mongodb.com/download-center/enterprise) and NodeJS (https://nodejs.org/en/) on your system.
2) Clone the project.

```bash
git clone https://github.com/Abhay3003/Innovaccer-Summer-Intern.git
```
3) Change directory to the required folder. 

```bash
cd Innovaccer
```
4) Install the dependencies using:
```bash
npm install
```
5) Enter your email id and password for sending mail in ``nodemailer.createTrasnport `` function.
6) Enter ``accountSid`` and ``authToken`` for Twilio. In ``from`` field of ``client.messages.create`` function enter the number provided by Twilio. 
7) Use two terminals. In one terminal run command:
 ```bash
mongod
``` 
8) In other terminal run the main file i.e. ***app.js*** using:
```bash
node app.js
```
9) Open ***localhost:3000*** on your browser.

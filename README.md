**The University of Melbourne**
# INFO30005 – Web Information Technologies

# Group Project Repository


## Table of contents
- [INFO30005 – Web Information Technologies](#info30005--web-information-technologies)
- [Group Project Repository](#group-project-repository)
  - [Table of contents](#table-of-contents)
  - [Team Members](#team-members)
  - [General info](#general-info)
  - [Packages](#packages)
  - [Project Website](#project-website)
    - [Example Customer Account](#example-customer-account)
    - [Example Vendor Accounts](#example-vendor-accounts)
  - [Database Access](#database-access)
  - [dotenv Variables](#dotenv-variables)
  - [TODO](#todo)

## Team Members

| Name | Task | State |
| :---         |     :---:      |          ---: |
| Jack Lenard  | Back End     |  In Progress|
| Jun Li Chen     | Back End      |  In Progress |
| Paris Eckert    | Front End      |  In Progress |
| Zac Beaumont    | Front End      |  In Progress |
| Jeongwoo Seo    | Front End      |  In Progress |

## General info
This is a project containing the product developed by our team for a business, for which we received a set of business requirements. This project demonstrates the culmination of skills acquired from lectures and workshops, while also practising the dynamics of working within a team for web development. 

## Packages
* **`mongoose`**
* **`express`**
* **`express-handlebars`**
* **`express-session`**
* **`handlebars`**
* **`dotenv`**
* **`bcrypt`**
* **`Mapbox GL JS`** (no package install needed)
* **`jsonwebtoken`**
* **`jest`**
* **`supertest`**
* **`socket.io`**
* **`cookie-parser`**

## Project Website
URL: `https://project-t16-ctrl-alt-elite.herokuapp.com/`
<br>Customer Homepage : `https://project-t16-ctrl-alt-elite.herokuapp.com/customer`
<br>Vendor Homepage : `https://project-t16-ctrl-alt-elite.herokuapp.com/vendor`
<br> *PS: Access the website through HTTPS since Geolocation API requires HTTPS to work properly.

### Example Customer Account

Email: `default@default.com`
<br>
Password: `default`



### Example Vendor Accounts

Van ID   #1: `Tasty_Trailer`
<br>
Password #1: `12345678`
<br><br>
VanID    #2: `Scrumptious_Servo`
<br>
Password #2: `12345678`
<br><br>
VanID    #3: `Diner_Driver`
<br>
Password #3: `12345678`


## Database Access

Full Connection String (using MongoDB Compass):
<br>
`mongodb+srv://defaultuser:defaultuser@ctrl-alt-elite.ys2d9.mongodb.net/test`

## dotenv Variables
```
MONGO_USERNAME=defaultuser
MONGO_PASSWORD=defaultuser
SECRET_KEY=secret
SALT=10
SECRET_OR_PUBLIC_KEY=secret
```

## TODO
- [x] Read the Project handouts carefully
- [x] User Interface (UI) mockup
- [x] App server mockup
- [x] Front-end + back-end (one feature)
- [ ] Complete system + source code
- [ ] Report on your work(+ test1 feature)
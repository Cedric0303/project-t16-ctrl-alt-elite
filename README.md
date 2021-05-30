**The University of Melbourne**
# INFO30005 – Web Information Technologies

## Final Commit
Commit hash: `07c152404c37e62b0f47c03d61e146cc9423e213`
# Group Project Repository


## Table of contents
- [INFO30005 – Web Information Technologies](#info30005--web-information-technologies)
  - [Final Commit](#final-commit)
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
  - [Known Issues](#known-issues)

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
* `mongoose`
* `express`
* `express-handlebars`
* `express-session`
* `handlebars`
* `dotenv`
* `bcrypt`
* `Mapbox GL JS`
* `jsonwebtoken`
* `jest`
* `supertest`
* `socket.io`
* `cookie-parser`
* `dotenv`

## Project Website
URL: `https://project-t16-ctrl-alt-elite.herokuapp.com/`
<br>Customer Homepage : `https://project-t16-ctrl-alt-elite.herokuapp.com/customer`
<br>Vendor Homepage : `https://project-t16-ctrl-alt-elite.herokuapp.com/vendor`
<br> *PS: Access the website through HTTPS since Geolocation API requires HTTPS to work properly.

### Example Customer Account

Email: `default@default.com`
<br>
Password: `n0td3fault`


### Example Vendor Accounts

Van ID   #1: `Tasty_Trailer`
<br>
Password #1: `Tasty12345`
<br><br>
VanID    #2: `Scrumptious_Servo`
<br>
Password #2: `s3rv0s3rv0`
<br><br>
VanID    #3: `Diner_Driver`
<br>
Password #3: `d1n3rd1n3r`


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
- [x] Complete system + source code
- [x] Report on your work(+ test1 feature)

## Known Issues
- Customer app
  - When tracking location live on homepage, the closest van is selected periodically whenever the location updates. This deselects the manually selected van.
  - When attempting to access the homepage with a pre-selected van that is not in the 5 closest vans to the user's location, the van is not selected.

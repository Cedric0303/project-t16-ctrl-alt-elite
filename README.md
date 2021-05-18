**The University of Melbourne**
# INFO30005 – Web Information Technologies

# Group Project Repository

<!-- Welcome!

We have added to this repository a `README.md`, `.gitignore`, and `.gitattributes`.

* **README.md**: is the document you are currently reading. It should be replaced with information about your project, and instructions on how to use your code in someone else's local computer.

* **.gitignore**: lets you filter out files that should not be added to git. For example, Windows 10 and Mac OS create hidden system files (e.g., .DS_Store) that are local to your computer and should not be part of the repository. This files should be filtered by the `.gitignore` file. This initial `.gitignore` has  been created to filter local files when using MacOS and Node. Depending on your project make sure you update the `.gitignore` file.  More information about this can be found in this [link](https://www.atlassian.com/git/tutorials/saving-changes/gitignore).

* **.gitattributes**: configures the line ending of files, to ensure consistency across development environments. More information can be found in this [link](https://git-scm.com/docs/gitattributes).

Remember that _"this document"_ can use `different formats` to **highlight** important information. This is just an example of different formating tools available for you. For help with the format you can find a guide [here](https://docs.github.com/en/github/writing-on-github). -->

## Table of contents
- [INFO30005 – Web Information Technologies](#info30005--web-information-technologies)
- [Group Project Repository](#group-project-repository)
  - [Table of contents](#table-of-contents)
  - [Team Members](#team-members)
  - [General info](#general-info)
  - [Technologies](#technologies)
    - [Packages](#packages)
  - [Postman Requests](#postman-requests)
    - [Customer App](#customer-app)
    - [Vendor App](#vendor-app)
    - [How to use Postman](#how-to-use-postman)
  - [Project Website](#project-website)
  - [Database Access](#database-access)
  - [.env Variables](#env-variables)
  <!-- - [Code Implementation](#code-implementation)
  - [Adding Images](#adding-images) -->

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

## Technologies
### Packages
* **mongoose**
* **express**
* **express-handlebars**
* **express-session**
* **handlebars**
* **dotenv**
* **bcrypt**
* **Mapbox GL JS** (no package install needed)
* **jsonwebtoken**
* **jest**
* **supertest**

**Now Get ready to complete all the tasks:**

- [x] Read the Project handouts carefully
- [x] User Interface (UI)mockup
- [x] App server mockup
- [x] Front-end + back-end (one feature)
- [ ] Complete system + source code
- [ ] Report on your work(+ test1 feature)


##  Postman Requests
### Customer App
- **GET** customer homescreen
  - returns the customer homescreen

- **GET** view menu of snacks
  - returns an array of JSON food objects(?) fetched from the database

- **GET** view details of an individual snack
  - returns a JSON file of an individual snack using the `:name` supplied from 
  `[server-name]/customer/menu/:name`

- **POST** start an order by requesting a snack
  - sends a JSON file of the `vendorID`, `loginID` & `count` of an individual snack using the `:name` supplied from `[server-name]/customer/menu/:name` and creates a new order with a new `OrderID`
  - returns the `name` of snack ordered

### Vendor App
- **GET** vendor homescreen
  - returns the customer homescreen

- **GET** view information of an individual vendor van
  - returns a JSON file of an individual vendor van using the `:id` supplied from `[server-name]/vendor/:id`

- **POST** set individual vendor van status & location
  - sends a JSON file of `address`, `latitude` & `longitude` of an individual vendor van using the `:id` supplied from `[server-name]/vendor/:id` to update said vendor van's status & location
  - returns a `Setting van status` message

- **GET** show list of outstanding orders for a vendor van
  - returns an array of JSON order objects(?) of a vendor van fetched from the database

- **POST** mark an individual order as 'fulfilled'
  - sets an order to 'fulfilled' using the `orderID` supplied from `[server-name]/vendor/:id/orders/:OrderID`

### How to use Postman
1. Import `Deliverable 2.postman_collection.json` into Postman.
2. Click on each requests to access them.
<p align="center">
  <img src="postman_request.gif"  width="1000" >
</p>

## Project Website
URL: `https://project-t16-ctrl-alt-elite.herokuapp.com/`

<br>Customer Homepage : `https://project-t16-ctrl-alt-elite.herokuapp.com/customer`
<br>Customer Email    : `default@default.com `
<br>Customer Password : `default `
<br>Customer location marker (blue icon on map) is temporarily draggable for testing purpose.

<br>Vendor Homepage : `https://project-t16-ctrl-alt-elite.herokuapp.com/vendor`
<br>Vendor loginID  : `Tasty_Trailer`
<br>Vendor Password : `12345678`

## Database Access
Connection String (using MongoDB Compass): `mongodb+srv://<username>:<password>@ctrl-alt-elite.ys2d9.mongodb.net/test`
<br>Username : `defaultuser` (replace `<username>`)
<br> Password : `defaultuser` (replace `<password>`)

## .env Variables
MONGO_USERNAME=`defaultuser`
<br>MONGO_PASSWORD=`defaultuser`
<br>SECRET_KEY=`secret`
<br>SALT=`10`
<br>SECRET_OR_PUBLIC_KEY=`secret`
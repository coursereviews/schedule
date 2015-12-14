Schedule [![Build Status](https://travis-ci.org/coursereviews/schedule.svg?branch=master)](https://travis-ci.org/coursereviews/schedule)
---

This is the primary repo for the MiddCourses Schedule.

## Install

Make sure you have [node](https://nodejs.org/en/) installed, everything else should work properly using the following command:

```bash
npm install
bower install
```

## Run

```bash
npm start
```

## Setup the database

Create the database at `db/schedule.db` and run migrations:

```bash
npm run migrate:latest
```

Scrape the Fall 2015 catalog and load it into the database:

```bash
node lib/scripts/scrape_catalog.js 201590
```

where `201590` is the term id.

## Code structure

### Root

The root directory contains configuration files including our `package.json`,
`makefile`, CI setup (`.travis.yml`), etc.

### data

Miscellaneous data used originally in place of a database.

### db

Where we store the SQLite database while running the app.

### img

Images for the readme.

### lib

The server side code.

 * **middleware**: middleware functions that can be required and applied to routes.
 * **models**: [Bookshelf.js](http://bookshelfjs.org/) model definitions.
 * **routes**: [Express](http://expressjs.com/) routes for the views and API. This
   is organized into sub-directories for each part of the API (schedule,
   catalog, extracurriculars, favorites) and the base routes, which are views
   rendered on the backend.
 * **scripts**: Command line scripts. Contains the script to scrape the catalog.
 * **settings**: Various configuration files for the app, database, and
   authentication.
 * **views**: Templates rendered on the backend. Top level templates are
   rendered by base routes. **views/templates** contain templates compatible
   with [Underscore](http://underscorejs.org/)'s `_.template` function.
   **views/partials**: are rendered as sub-templates of top level views.
   **views/layouts**: contains a layout into which all other templates are
   inserted.

### public

 The client side code. **js/vendor** contains third-party code not available
 on Bower or a CDN. License is included. At the top level either **app.js**
 or **settings-app.js** kicks off the router and `Backbone.history`.

 * **css**: Stylesheets divided into code that applies to the whole app, the
   scheduling subview, and the settings page.
 * **js**: [Backbone](http://backbonejs.org/) models, views, collections, and
   routers divided into their respective directories.

### test

 Unit tests for our API and base routes. Running the tests clears the database,
 logs in using a [headless agent](https://github.com/visionmedia/supertest)
 and performs requests, checking the responses for correctness.

 A test catalog is included as a file at **test/test.xml**.

## Using the Catalog API


[Syntax Diagram of the catalog API](./img/catalog_api_diagram.png)

Example URL to get catalog data:  
http://localhost:8000/api/catalog/query/course?department_id=6&id=11  

The catalog API only takes GET requests. For each request (which will query a DB table),
a list of results matching the query will be returned.  
Each item in this list will contain (in JSON format) the appropriate fields of the row in the database that the item corresponds to, along with the data related to that row as defined by the DB schema.
(For more details on the structure of the data returned, view the results of a catalog API GET request in the browser).  
Below is a list of each table along with the tables from which it gets its "related" data (these are almost the exact database table relationships):  

- **course:** department, courseoffering  
- **courseoffering:** course, term, professor, schedule, requirement, meeting
- **department:** course  
- **meeting:** courseoffering  
- **professor:** courseoffering  
- **requirement:** courseoffering  
- **term:** courseoffering  



## Running Tests

It's really simple!!!  

```bash
make test
```

## Authors

- Dana Silver
- Yanfeng Jin (Tony)
- Paolo Bernasconi
- Gilbert Kipkorir
- Julian Billings
- Sofy Maia
- Amanuel Afework
- Khi Chou
- Andrew Jung

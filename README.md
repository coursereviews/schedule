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

## Environment Variables

None so far.

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

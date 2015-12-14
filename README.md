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

## Using the API

Syntax Diagram of the catalog API:


Example URL to get catalog data:  
http://localhost:8000/api/catalog/query/course?department_id=6&id=11

## Running Tests

It's really simple!!!  

[! Alt text](./img/catalog_api_diagram.png)

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

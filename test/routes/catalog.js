'use strict';

/* global describe, it, before */

const Promise = require('bluebird');
const load = require('../load_data');
const supertest = require('supertest');
var agent, app, superAgent;


var authedAgent;

describe('api/catalog GET request tests', function() {

  before('fill database, add user profile', function(done) {

    this.timeout(15000); // db ops take a while

    load.main()
    .then(function() {
      return require('../../lib/server');
    }).then(function(result) {
      // result = require('../../lib/server');
      app = result;
      return supertest(app);
    }).then(function(sA) {
      // sA = supertest(app);
      superAgent = sA;
      superAgent
        .post('/signup')
        .send({name: 'julian', email: 'jabillings@middlebury.edu', password: 'julian'})
        .end(done);
      })
    .catch(function(err) {
      console.log(err);
    });
  })

  describe('/api/catalog/courses GET requests', function() {

    before(Promise.coroutine(function*(done) {
      agent = require('../agent');
      authedAgent = yield agent;
    }));

    it('should return all courses with no query params', function(done) {

      authedAgent
        .get('/api/catalog/query/course')
        .expect(200)
        .expect(function(res) {
          if (res.body.length !== 117) {
            throw new Error("Incorrect number of courses returned");
          }
        })
        .end(done);
    });

    it('should return correct course with a single id param', function(done) {

       authedAgent
        .get('/api/catalog/query/course?id=5')
        .expect(200)
        .expect(function(res) {
          if (res.body.length !== 1) {
            throw new Error("Incorrect number of courses returned");
          }
        })
        .expect(function(res) {
          if (res.body[0].title !== 'Adv Chns Read/Wrtng/Convrstn') {
            throw new Error("Incorrect course returned");
          }
        })
        .end(done);
    });

    // NEED TESTS FOR FUZZY DESCRIPTION SEARCH

    it('should return correct course with a single title param', function(done) {

      authedAgent
       .get('/api/catalog/query/course?title=Senior_Independent_Study')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].title !== 'Senior Independent Study') {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    it('should return correct courses with a single type param', function(done) {

      authedAgent
       .get('/api/catalog/query/course?type=Seminar')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 117) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .end(done);
    });

    it('should return correct course with a single code param', function(done) {

      authedAgent
       .get('/api/catalog/query/course?code=GSFS0301')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].id !== 79) {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    it('should return correct courses with a single department_id param', function(done) {

      authedAgent
       .get('/api/catalog/query/course?department_id=29')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 2) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .end(done);
    });

    it('should return correct courses when multiple parameters are inputted', function(done) {

      authedAgent
       .get('/api/catalog/query/course?department_id=29&id=111')
       .expect(200)
       .expect(function(res) {
         if (res.body[0].title !== 'Seminar in the New Testament') {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

  });

  describe('/api/catalog/courseoffering GET requests', function() {

    before(Promise.coroutine(function*(done) {
      authedAgent = yield agent;
    }));

    it('should return all courseofferings with no query params', function(done) {

      authedAgent
        .get('/api/catalog/query/courseoffering')
        .expect(200)
        .expect(function(res) {
          if (res.body.length !== 126) {
            throw new Error("Incorrect number of courses returned");
          }
        })
        .end(done);
    });

    it('should return correct courseoffering with a single id', function(done) {

      authedAgent
       .get('/api/catalog/query/courseoffering?id=56')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].id !== 56) {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    it('should return correct courseoffering with a single course_id', function(done) {

      authedAgent
       .get('/api/catalog/query/courseoffering?course_id=58')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].id !== 62) {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    it('should return correct courseoffering with a single term_id', function(done) {

      authedAgent
       .get('/api/catalog/query/courseoffering?term_id=1')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 126) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .end(done);
    });

    // ignore hrefs for now
    /*
    it('should return correct courseoffering with a single href', function(done) {

      authedAgent
       .get('/api/catalog/query/courseoffering?href=http://catalog.middlebury.edu/offerings/view/catalog/catalog%2FMCUG/offering/section%2F201590%2F90038')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].id !== 121) {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });
    */

    it('should return correct courseoffering with a single course code', function(done) {

      authedAgent
       .get('/api/catalog/query/courseoffering?course_code=ECON0701A-F15')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].id !== 22) {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    it('should return correct courseoffering with a single crn', function(done) {

      authedAgent
       .get('/api/catalog/query/courseoffering?crn=91366')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].id !== 34) {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    it('should return correct courseoffering with multiple params', function(done) {

      authedAgent
       .get('/api/catalog/query/courseoffering?crn=90668&course_id=24')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].id !== 28) {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

  });

  describe('/api/catalog/department GET requests', function() {

    it('should return correct number of departments with no params', function(done) {
      authedAgent
       .get('/api/catalog/query/department')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 33) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .end(done);
    });

    it('should return correct department with one id param', function(done) {
      authedAgent
       .get('/api/catalog/query/department?id=19')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].code !== 'INTD') {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    it('should return correct department with one code param', function(done) {
      authedAgent
       .get('/api/catalog/query/department?code=PHIL')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].id !== 25) {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    // NOTE/TODO: names with '&' in them don't work right now
    it('should return correct department with one name param', function(done) {
      authedAgent
       .get('/api/catalog/query/department?name=Prog_in_Neuroscience')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].id !== 24) {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    it('should return correct department with multiple params', function(done) {
      authedAgent
       .get('/api/catalog/query/department?name=International_&_Global_Studies&code=HIST')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].id !== 17) {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

  });

  describe('/api/catalog/meeting GET requests', function() {

    it('should return correct number of meetings with no params', function(done) {
      authedAgent
       .get('/api/catalog/query/meeting')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 134) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .end(done);
    });

    it('should return correct meeting with one id param', function(done) {
      authedAgent
       .get('/api/catalog/query/meeting?id=17')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].days !== 'Tuesday,Thursday' ||
          res.body[0].start_date !== 'Sep 16, 2015') {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    it('should return correct meeting with one course_offering_id param', function(done) {
      authedAgent
       .get('/api/catalog/query/meeting?course_offering_id=13')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].start_time !== '1:30pm' || res.body[0].days !== 'Tuesday,Thursday') {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    it('should return correct number of meetings with one start_time param', function(done) {
      authedAgent
       .get('/api/catalog/query/meeting?start_time=11:00am')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 20) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .end(done);
    });

    it('should return correct number of meetings with one end_time param', function(done) {
      authedAgent
       .get('/api/catalog/query/meeting?end_time=10:45am')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 12) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .end(done);
    });

    it('should return correct number of meetings with one start_date param', function(done) {
      authedAgent
       .get('/api/catalog/query/meeting?start_date=Sep_16,_2015')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 134) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .end(done);
    });

    it('should return correct number of meetings with one end_date param', function(done) {
      authedAgent
       .get('/api/catalog/query/meeting?end_date=Dec_11,_2015')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 134) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .end(done);
    });

    it('should return correct number of meetings with one days param', function(done) {
      authedAgent
       .get('/api/catalog/query/meeting?days=Wednesday')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 5) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .end(done);
    });

    it('should return correct department with multiple params', function(done) {
      authedAgent
       .get('/api/catalog/query/meeting?days=Tuesday,Thursday&end_time=2:45pm')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 19) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .end(done);
    });

  });

  describe('/api/catalog/professor GET requests', function() {

    it('should return correct number of professors with no params', function(done) {
      authedAgent
       .get('/api/catalog/query/professor')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 103) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .end(done);
    });

    it('should return correct professor with one id param', function(done) {
      authedAgent
       .get('/api/catalog/query/professor?id=75')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].midd_id !== '3634f15f36d6f25a08b4bb0203078ff8') {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    it('should return correct professor with one name param', function(done) {
      authedAgent
       .get('/api/catalog/query/professor?name=Jay_Parini')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].id !== 27) {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    it('should return correct professor with one midd_id param', function(done) {
      authedAgent
       .get('/api/catalog/query/professor?midd_id=7c85d384a845d8094bfdc46237df3b07')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].name !== 'Yumna Siddiqi') {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    it('should return correct professor with multiple params', function(done) {
      authedAgent
       .get('/api/catalog/query/professor?name=Brett_Millier&midd_id=e34554346788b8778ea8b40079c181c4')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].id !== 20) {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

  });

  describe('/api/catalog/requirement GET requests', function() {

    it('should return correct number of requirements with no params', function(done) {
      authedAgent
       .get('/api/catalog/query/requirement')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 13) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .end(done);
    });

    it('should return correct requirement with one id param', function(done) {
      authedAgent
       .get('/api/catalog/query/requirement?id=8')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].name !== 'ART') {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    it('should return correct requirement with one code param', function(done) {
      authedAgent
       .get('/api/catalog/query/requirement?code=CW')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].id !== 11) {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    it('should return correct requirement with one name param', function(done) {
      authedAgent
       .get('/api/catalog/query/requirement?name=LNG')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].id !== 4) {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    it('should return correct requirment with multiple params', function(done) {
      authedAgent
       .get('/api/catalog/query/requirement?name=SOC&id=10')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].code !== 'SOC') {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

  });

  describe('/api/catalog/term GET requests', function() {

    it('should return correct number of terms with no params', function(done) {
      authedAgent
       .get('/api/catalog/query/term')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .end(done);
    });

    it('should return correct term with one id param', function(done) {
      authedAgent
       .get('/api/catalog/query/term?id=1')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].code !== '201590') {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    it('should return correct term with one code param', function(done) {
      authedAgent
       .get('/api/catalog/query/term?code=201590')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].id !== 1) {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

    it('should return correct term with multiple params', function(done) {
      authedAgent
       .get('/api/catalog/query/term?code=201590&id=1')
       .expect(200)
       .expect(function(res) {
         if (res.body.length !== 1) {
           throw new Error("Incorrect number of courses returned");
         }
       })
       .expect(function(res) {
         if (res.body[0].code !== '201590') {
           throw new Error("Incorrect course returned");
         }
       })
       .end(done);
    });

  });
});

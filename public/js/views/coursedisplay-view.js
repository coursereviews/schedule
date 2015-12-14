/* $(function() {
  //get qualifier lists
  var descripkey = document.getElementById('keysearch');
  var profkey = document.getElementById('profsearch');
  var locslist = document.getElementById('loc_select');
  var depts = document.getElementById('dept_list');
  var reqs = document.getElementById('req_list');
  var qualifsArr = Array.from(depts.children).concat(Array.from(reqs.children));

  var Click = function(clicked) {

    var selDept = Array.from(depts.getElementsByClassName('list-group-item clicked'));
    var selReq = Array.from(reqs.getElementsByClassName('list-group-item clicked'));
    var selLoc = Array.from(locslist.getElementsByClassName('list-group-item clicked'));

    if (clicked.className !== 'list-group-item clicked') {
      clicked.className = 'list-group-item clicked';
    } else {
      clicked.className = 'list-group-item';
    }

    if (clicked.attributes[1].value === 'department') {
      selDept = unclick(selDept, clicked);
    } else if (clicked.attributes[1].value === 'requirement') {
      selReq = unclick(selReq, clicked);
    } else if (clicked.attributes[1].value === 'location') {
      selLoc = unclick(selLoc, clicked);
    }

    function unclick(selected, newItem) {
      if (selected.length > 0) {
        selected[0].className = 'list-group-item';
      }
      if (selected[0] !== newItem) {
        selected = [newItem];
        return selected;
      }
      selected = [];
      return selected;
    }

    var querystring = 'query?';
    var selected = Array.from(selDept).concat(Array.from(selReq).concat(Array.from(selLoc)));
    selected.forEach(function(selItem) {
      querystring += selItem.id;
    });

    getData(querystring);
  };

  //add event listener to all depts & reqs
  qualifsArr.forEach(function(elmnt) {
    elmnt.addEventListener('click', function() {
      Click(elmnt);
    });
  });
  locslist.onchange = function() {
    Click(document.getElementsByTagName('option')[locslist.selectedIndex]);
  }
});

var getData = function(url) {
  var request = new XMLHttpRequest();
  var path = 'http://localhost:8000/api/catalog/' + url;
  request.open('GET', path, true);
  request.setRequestHeader('Content-Type', 'text/xml');
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      displayCourses(JSON.parse(request.responseText));
    }
  };
  request.send(null);
};

var displayCourses = function(courses) {

  //empty resultList
  var resultList = document.getElementById('courses');
  resultList.innerHTML = '';

  var headerTemplate = '<div class='
  course - panel - heading '><table><tr>' +
    '<td style='
  width: 650 px '><h5 style='
  color: white '>#TITLE#</h5></td>' +
    '<td style='
  width: 200 px '><h6 style='
  color: white ' align=right>#CODE#</h6></td></tr></table></div>';
  var bodyTemplate = '<div class='
  course - panel - body '><div class='
  row '>' +
    '<div class='
  col - lg - 12 '><table class='
  table '><tr><td colspan=2>#PROFESSOR#</td></tr>' +
    '<tr><td colspan=2>#DESCRIPTION#</td></tr><tr><td>Location: #LOCATION#</td><td>Schedule: #SCHEDULE#</td></tr>' +
    '<tr><td>Requirements: #REQUIREMENTS#</td><td>CRN: #CRN#</td></tr><tr><td colspan=2 align=center>' +
    '<a href=#HREF# class='
  btn btn - primary '>Catalog Entry</a></td></tr></table></div></div></div>';

  //create new HTML coursecards for each course then append to resultList
  courses.forEach(function(crs) {
    var contents = headerTemplate.replace(/#[^#]*#/g, function(substring) {
      var property = substring.slice(1, -1);
      if (property === 'TITLE') {
        return crs.title;
      } else if (property === 'CODE') {
        return crs.code;
      }
    });
    var fullContents = bodyTemplate.replace(/#[^#]*#/g, function(substring) {
      var property = substring.slice(1, -1);
      if (property === 'PROFESSOR') {
        return crs.instructor;
      } else if (property === 'DESCRIPTION') {
        return crs.description;
      } else if (property === 'LOCATION') {
        return crs.location;
      } else if (property === 'SCHEDULE') {
        return crs.schedule;
      } else if (property === 'REQUIREMENTS') {
        return crs.requirements;
      } else if (property === 'CRN') {
        return crs.CRN;
      } else if (property === 'HREF') {
        return crs.href;
      }
    });

    var temp = document.createElement('div');
    temp.className = 'col-md-12';
    temp.setAttribute('style', 'padding-top:.35cm');
    temp.innerHTML = contents;

    temp.addEventListener('click', function() {
      if (temp.className !== 'col-md-12 open') {
        temp.className = 'col-md-12 open';
        temp.innerHTML = contents + fullContents;
      } else {
        temp.innerHTML = contents;
        temp.className = 'col-md-12';
      }
    });

    resultList.appendChild(temp);

  });
};

*/

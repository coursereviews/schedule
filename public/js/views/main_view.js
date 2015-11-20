window.onload = function displayResults(){
  var depts = document.getElementById("dept_list").children;
  depts = Array.from(depts);
  depts.forEach(function(elmnt){
    elmnt.addEventListener("click", function(){
      getData('subject='+elmnt.id, elmnt);
    });
  });
};

var getData = function(url, dept){
  var request = new XMLHttpRequest();
  var path = 'http://localhost:8000/api/catalog/query?'+url;
  request.open('GET', path, true);
  request.setRequestHeader("Content-Type", "text/xml");
  request.onreadystatechange = function(){
    if (request.readyState === 4 && request.status === 200){
      displayCourses(JSON.parse(request.responseText));}
  };
  request.send(null);
};

var displayCourses = function(courses){

  //empty resultList
  var resultList = document.getElementById("courses");
  resultList.innerHTML = "";

  var headerTemplate = "<div class='course-panel-heading'>" +
      "<h5 style='color:white'>#TITLE#</h5><h6 style='color:white' align=left>#CODE#</h6>" +
      "<h6 style='color:white' align=left>#PROFESSOR#</h6></div>";
  var bodyTemplate = "<div class='course-panel-body'><div class='row'>" +
          "<div class='col-lg-12'><table class='table'><tr><td colspan=2>#DESCRIPTION#</td></tr>" +
          "<tr><td>Location: #LOCATION#</td><td>Schedule: #SCHEDULE#</td></tr>" +
          "<tr><td>Requirements: #REQUIREMENTS#</td><td>CRN: #CRN#</td></tr><tr><td colspan=2 align=center>" +
          "<a href=#HREF# class='btn btn-primary'>Catalog Entry</a></td></tr></table></div></div></div>";

  //create new HTML coursecards for each course then append to resultList
  courses.forEach(function(crs){
    var contents = headerTemplate.replace(/#[^#]*#/g,function(substring){
      var property = substring.slice(1,-1);
      if(property === 'TITLE'){return crs.title;}
      else if(property === 'CODE'){return crs.code;}
      else if(property === 'PROFESSOR'){return crs.instructor;}
    });
    var fullContents = bodyTemplate.replace(/#[^#]*#/g,function(substring){
      var property = substring.slice(1,-1);
      if(property === 'DESCRIPTION'){return crs.description;}
      else if(property === 'LOCATION'){return crs.location;}
      else if(property === 'SCHEDULE'){return crs.schedule;}
      else if(property === 'REQUIREMENTS'){return crs.requirements;}
      else if(property === 'CRN'){return crs.CRN;}
      else if(property === 'HREF'){return crs.href;}
    });

    var temp = document.createElement('div');
    temp.className='col-md-9';
    temp.setAttribute("style","padding-top:.5cm"); temp.setAttribute("id","results");
    temp.innerHTML = contents;

    temp.addEventListener("click",function(){
      if(temp.className !== 'col-md-9 open'){
        temp.className = 'col-md-9 open';
        temp.innerHTML = contents + fullContents;
      }else{
        temp.innerHTML = contents;
        temp.className = 'col-md-9';}
    });

    resultList.appendChild(temp);

  });
};

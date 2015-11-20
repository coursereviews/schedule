window.onload = function displayResults(){
  //get qualifier lists
  var depts = document.getElementById("dept_list");
  var reqs = document.getElementById("req_list");
  var qualifsArr = Array.from(depts.children).concat(Array.from(reqs.children));

  var addClick = function(elmnt){
    //add event listener to all depts & reqs, build querystring from currently selected elements
    elmnt.addEventListener("click", function(){

      if(elmnt.className !== 'list-group-item clicked'){elmnt.className = 'list-group-item clicked';}
      else{elmnt.className = 'list-group-item';}

      var querystring = 'query?';
      var selected = Array.from(depts.getElementsByClassName('list-group-item clicked'))
             .concat(Array.from(reqs.getElementsByClassName('list-group-item clicked')));

      selected.forEach(function(selItem){querystring += selItem.id;});

      getData(querystring);});
  };

  qualifsArr.forEach(function(elmnt){addClick(elmnt);});
};

var getData = function(url){
  var request = new XMLHttpRequest();
  var path = 'http://localhost:8000/api/catalog/'+url;
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

  var headerTemplate = "<div class='course-panel-heading'><table><tr>" +
      "<td style='width:650px'><h5 style='color:white'>#TITLE#</h5></td>" +
      "<td style='width:200px'><h6 style='color:white' align=right>#CODE#</h6></td></tr></table></div>";
  var bodyTemplate = "<div class='course-panel-body'><div class='row'>" +
          "<div class='col-lg-12'><table class='table'><tr><td colspan=2>#PROFESSOR#</td></tr>" +
          "<tr><td colspan=2>#DESCRIPTION#</td></tr><tr><td>Location: #LOCATION#</td><td>Schedule: #SCHEDULE#</td></tr>" +
          "<tr><td>Requirements: #REQUIREMENTS#</td><td>CRN: #CRN#</td></tr><tr><td colspan=2 align=center>" +
          "<a href=#HREF# class='btn btn-primary'>Catalog Entry</a></td></tr></table></div></div></div>";

  //create new HTML coursecards for each course then append to resultList
  courses.forEach(function(crs){
    var contents = headerTemplate.replace(/#[^#]*#/g,function(substring){
      var property = substring.slice(1,-1);
      if(property === 'TITLE'){return crs.title;}
      else if(property === 'CODE'){return crs.code;}
    });
    var fullContents = bodyTemplate.replace(/#[^#]*#/g,function(substring){
      var property = substring.slice(1,-1);
      if(property === 'PROFESSOR'){return crs.instructor;}
      else if(property === 'DESCRIPTION'){return crs.description;}
      else if(property === 'LOCATION'){return crs.location;}
      else if(property === 'SCHEDULE'){return crs.schedule;}
      else if(property === 'REQUIREMENTS'){return crs.requirements;}
      else if(property === 'CRN'){return crs.CRN;}
      else if(property === 'HREF'){return crs.href;}
    });

    var temp = document.createElement('div');
    temp.className='col-md-12';
    temp.setAttribute("style","padding-top:.35cm");
    temp.innerHTML = contents;

    temp.addEventListener("click",function(){
      if(temp.className !== 'col-md-12 open'){
        temp.className = 'col-md-12 open';
        temp.innerHTML = contents + fullContents;
      }else{
        temp.innerHTML = contents;
        temp.className = 'col-md-12';}
    });

    resultList.appendChild(temp);

  });
};

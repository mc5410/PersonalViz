// Globally head date object for the month shown
var date = new Date();
// console.log(date);
date.setDate(date.getDate());
date.setMonth(8);

window.onload = function() {
    // Add the current month on load

    createMonth();
    heatmap();
};

document.onkeydown = function(evt) {
    evt = evt || window.event;
    switch (evt.keyCode) {
        case 37:
            previousMonth();
            break;
        case 39:
            nextMonth();
            break;
    }
};

// Converts day ids to the relevant string
function dayOfWeekAsString(dayIndex) {
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex];
    }
    // Converts month ids to the relevant string
function monthsAsString(monthIndex) {
    return ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][monthIndex];
}

// Creates a day element
function createCalendarDay(num, day, mon, year) {
    var currentCalendar = document.getElementById("calendar");

    var newDay = document.createElement("div");
    var date = document.createElement("p");
    var dayElement = document.createElement("p");

    date.innerHTML = num;
    dayElement.innerHTML = day;

    newDay.className = "calendar-day ";

    // Set ID of element as date formatted "8-January" etc 
    newDay.id = num + "-" + mon + "-" +year;

    newDay.appendChild(date);
    newDay.appendChild(dayElement);
    // currentCalendar.appendChild(newDay);
}

// // Clears all days from the calendar
// function clearCalendar() {
//     var currentCalendar = document.getElementById("calendar");

//     currentCalendar.innerHTML = "";

// }

// Clears the calendar and shows the next month
function nextMonth() {
    // clearCalendar();
    date.setMonth(date.getMonth() + 1);
    createMonth(date.getMonth());
    heatmap(date.getMonth()+1);
}

// Clears the calendar and shows the previous month
function previousMonth() {
    // clearCalendar();
    date.setMonth(date.getMonth() - 1);
    var val = date.getMonth();
    createMonth(date.getMonth());
    heatmap(date.getMonth()-1);
}

// Creates and populates all of the days to make up the month
function createMonth() {
    var currentCalendar = document.getElementById("calendar");

    var dateObject = new Date();
    dateObject.setDate(date.getDate());
    dateObject.setMonth(date.getMonth());
    dateObject.setYear(date.getFullYear());

    createCalendarDay(dateObject.getDate(), dayOfWeekAsString(dateObject.getDay()), monthsAsString(dateObject.getMonth()), dateObject.getFullYear());

    dateObject.setDate(dateObject.getDate() + 1);

    while (dateObject.getDate() != 1) {
        createCalendarDay(dateObject.getDate(), dayOfWeekAsString(dateObject.getDay()), monthsAsString(dateObject.getMonth()), dateObject.getFullYear());
        dateObject.setDate(dateObject.getDate() + 1);
    }

    // Set the text to the correct month
    var currentMonthText = document.getElementById("current-month");
    currentMonthText.innerHTML = monthsAsString(date.getMonth()) + " " + date.getFullYear();
    getCurrentDay();

}
function heatmap(){


      var margin = { top: 15, right: 0, bottom: 60, left: 180 },
          width = 2000 - margin.left - margin.right,
          height = 490 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 48 ),
          legendElementWidth = gridSize*2,
          buckets = 9,
          colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          days = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15", "16", "17", "18", "19", "20", "21","22","23","24","25","26","27","28","29","30"],
          times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
          // times = ["6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p","1a", "2a", "3a", "4a"];
          datasets = ["proftsv.tsv"];
      console.log(days);
      var svg = d3.select("#chart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var dayLabels = svg.selectAll(".dayLabel")
          .data(days)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * (gridSize/3); })
            .style("text-anchor", "end")
            .attr("transform", "translate(-8," + gridSize / 3.8 + ")")
            .attr("class", "dayLabel mono axis axis-workweek");

      var timeLabels = svg.selectAll(".timeLabel")
          .data(times)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", "timeLabel mono axis axis-worktime");

      var heatmapChart = function(tsvFile) {

        d3.tsv(tsvFile,
        function(d) {         
          return {
         
            day: +d.day,
            hour: +d.hour,           
            value: +d.value,
            dayname: d.dayname,
            app: d.app
          };
        },
       
        function(error, data) {
          var colorScale = d3.scale.quantile()
              .domain([0,50,200,800, 1000, 1500,2000, 3000 , 3500])
              .range(colors);
          console.log(data);
          var cards = svg.selectAll(".hour")
              .data(data, function(d) {return d.day+':'+d.hour;});

          cards.append("title");
          var r = new Date();
          cards.enter().append("rect")
              .attr("x", function(d) { return (d.hour - 1) * (gridSize); })
              .attr("y", function(d) { return (d.day - 1 ) * (gridSize/3); })
              .attr("rx", 1)
              .attr("ry", 1)
              .attr("class", "hour bordered")
              .attr("width", gridSize)
              .attr("height", gridSize/3)
              .style("fill", colors[0])
              .on('mouseover',function(d){
            
                            var tool = d3.select("#tooltip").attr("class", "tooltip").style("opacity", 0);
                            tool.select("#tipname").text("Day : "+ d.dayname);
                            tool.select("#tipgdp").text("Time Spent : "+(d.value/60).toFixed(0));
                            tool.select("#tipapp").text("Apps Used: "+ d.app);
                            
                        
                 tool.transition()        
                .duration(200)      
                .style("opacity", .9) 
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
                            
                                var matrix = this.getScreenCTM()
                                .translate(+ this.getAttribute("cx"), + this.getAttribute("cy"));
                
                            tool.style({
                                'display' : 'block', 
                                'opacity' : '0.9',
                                'position' : 'auto',
                                'cursor' : 'pointer',
                                'top' : (window.pageYOffset + matrix.f - 30)+2,//d3.select(this).attr("cy")+1,
                                'left': (window.pageXOffset + matrix.e + 15)+2//d3.select(this).attr("cx")+1
                            })
 
                         })

              .on('mouseout',function(){
                          d3.select(this)                
                            var tool = d3.select("#tooltip").attr("class", "tooltip").style("opacity", 0);                
                            tool.transition()        
                            .duration(500)      
                            .style("opacity", 0.9);                 
                            tool.style({
                                    'display' : 'none' 
                            })
                             });


          cards.transition().duration(2500)
              .style("fill", function(d) { return colorScale(d.value); });

          cards.select("title").text(function(d) { return d.value; });
         
          cards.exit().remove();

          var legend = svg.selectAll(".legend")
              .data([0,200,800, 1000, 1500,2000, 3000 , 3500]);

          legend.enter().append("g")
              .attr("class", "legend");

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 4)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .text(function(d) { return "> " + Math.round(d/60); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + gridSize);

          legend.exit().remove();

        });  
      };

      heatmapChart(datasets[0]);
      
      var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
        .data(datasets);

      datasetpicker.enter()
        .append("input")
        .attr("value", function(d){ return "Dataset " + d })
        .attr("type", "button")
        .attr("class", "dataset-button")
        .on("click", function(d) {
          heatmapChart(d);
        });

      // d3.selectAll("svg > *").remove();
  
}

function getCurrentDay() {

    // Create a new date that will set as default time
    var todaysDate = new Date();
    var today = todaysDate.getDate();
    var currentMonth = todaysDate.getMonth();
    var currentYear = todaysDate.getFullYear();
    var thisMonth = monthsAsString(currentMonth);
    // Find element with the ID for today
    currentDay = document.getElementById(today + "-" + thisMonth + "-" + currentYear);
    // currentDay.className = "calendar-day today";
}

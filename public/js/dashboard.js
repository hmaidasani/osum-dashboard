var update_interval = 1000 * 5;
var max_time_difference = 1000 * 60 * 2; //2 minutes for now
var num_piecharts = 10;

var linechart;
var piecharts = new Array();
var linedata, piedata;

var linechart_options = {
    displayAnnotations: true,
    annotationsWidth: 15
  };
var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

function init() {
  setupTriggers();
  setupGraphs();

}

function setupTriggers() {
  //default 7 day period
  var date = new Date();
  var today = monthNames[date.getMonth()] + ' ' + date.getDate();
  var before = monthNames[date.getMonth()] + ' ' + (date.getDate()-6);
  $('#panel-title').text(before + ' - ' + today);
  $('#7daybtn').addClass('active');

  $('.graph-panel').click(function(event) {
    $('.graph-panel > .graph-title.selected').removeClass('selected');
    $(this).children('.graph-title').addClass('selected');
  });

  $('#addMetric').click(function(event) {
    $('#myModal').modal('show');
  }); 
}

function setupGraphs() {
  initLineChart();
  initPieCharts();
  updatePieCharts();

 setInterval('updateGraphs()', update_interval);
}

function initLineChart() {
  linedata = new google.visualization.DataTable();
  linedata.addColumn('datetime', 'Time');
  linedata.addColumn('number', 'FCIs');
  linedata.addColumn('string', 'Title');
  linedata.addColumn('string', 'Text');
  var date = new Date();
  var i = -15;
  linedata.addRows([
    [new Date(date.getTime() + i++ * 5000), 20, undefined, undefined],
    [new Date(date.getTime() + i++ * 5000), 50, undefined, undefined],
    [new Date(date.getTime() + i++ * 5000), 250, 'Failed logins', 'High number of users failed to login.'],
    [new Date(date.getTime() + i++ * 5000), 370, undefined, undefined],
    [new Date(date.getTime() + i++ * 5000), 30, 'Login issues resolved.', undefined],
    [new Date(date.getTime() + i++ * 5000), 25, undefined, undefined],
    [new Date(date.getTime() + i++ * 5000), 40, undefined, undefined],
    [new Date(date.getTime() + i++ * 5000), 60, undefined, undefined],
    [new Date(date.getTime() + i++ * 5000), 30, undefined, undefined],
    [new Date(date.getTime() + i++ * 5000), 80, undefined, undefined],
    [new Date(date.getTime() + i++ * 5000), 35, undefined, undefined],
    [new Date(date.getTime() + i++ * 5000), 15, undefined, undefined],
    [new Date(date.getTime() + i++ * 5000), 20, undefined, undefined],
    [new Date(date.getTime() + i++ * 5000), 40, undefined, undefined],
    [new Date(date.getTime() + i++ * 5000), 60, undefined, undefined]
  ]);
  linechart = new google.visualization.AnnotatedTimeLine(document.getElementById('linechart'));
  linechart.draw(linedata, linechart_options);
}

function updateGraphs() {
  getLineData();
  updatePieCharts();
}

function updateLineGraph(data) {
  linedata.addRows(data);
  deleteOldData(linedata);
  linechart.draw(linedata, linechart_options);
}

function deleteOldData(data) {
  var currentDate = new Date();
  var rowInds = data.getSortedRows([{column: 0}]);
  var numRows = 0;
  for (var i = 0; i < rowInds.length; i++) {
    var date = data.getValue(rowInds[i], 0);
    var diff = currentDate - date;
    if(diff >= max_time_difference) {
      numRows++;
    } else {
      break;
    }
  }
  data.removeRows(0, numRows);
}

function getLineData() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
         var response = xmlhttp.responseText;
         console.log(response);
         var json = eval('(' + response + ')');
        if(Math.random() <= 0.85) {
          updateLineGraph([[new Date(json.time), json.count, undefined, undefined]]);
        } else {
          updateLineGraph([[new Date(json.time), json.count, 'Event', 'description']]);
        }
     }
  };
  xmlhttp.open('GET', 'http://localhost:5000/request', true);
  xmlhttp.send();
}

piedata = [
    { label: "Database", data: 1, color: { colors: [ "#d3ffaf", "#beff88", "#76ff04", "#84f128", "#9cec57", "#88c257" ] }},
    { label: "Alpha", data: 1, color: { colors: [ "#d3ffaf", "#beff88", "#76ff04", "#84f128", "#9cec57", "#88c257" ] } },
    { label: "Layer", data: 1, color: { colors: [ "#d3ffaf", "#beff88", "#76ff04", "#84f128", "#9cec57", "#88c257" ] } },
    { label: "Web", data: 1, color: { colors: [ "#d3ffaf", "#beff88", "#76ff04", "#84f128", "#9cec57", "#88c257" ] } }
    ];

var options = {
      series: {
          pie: {
            innerRadius: 0.5,
            radius: 0.8,
            show: true,
            stroke: {
              color: '#cccccc',
              width: 2
            },
            label: {
                show: false
            }
          }
      },
      legend: {
          show: false
      },
      grid: {
        // backgroundColor:{ colors: ["#000", "#999"] },
          hoverable: true
      }
    };

function initPieCharts() {
  var pieTitle = "Swim Lane";
  for(var i = 0; i < num_piecharts; i++) {

   $.plot('#pie'+(i+1), piedata, options);
   $('#pie'+(i+1)+'Title').text(pieTitle + ' ' + (i+1));

   var previousLabel = null, previousChart;
   $(".pie").bind("plothover", function (event, pos, item) {
      if (item) {
        if (previousLabel != item.series.label || previousChart != document.elementFromPoint(pos.pageX, pos.pageY).parentNode.id) {
            previousLabel = item.series.label;
            previousChart = document.elementFromPoint(pos.pageX, pos.pageY).parentNode.id;
            $("#tooltip").remove();
            
            showTooltip(pos.pageX, pos.pageY,
                        item.series.label, item.seriesIndex);
        }
      }
      else {
          $("#tooltip").remove();
          previousLabel = null;            
          previousChart = null;
      }
    });
  }

  if(num_piecharts*$('#pie1').width() > $('#piecharts_container').width()){
    $('#rightButton').removeClass('hidden');
    $('#rightButton').addClass('visible');
  }

  var maxScroll = document.getElementById('piecharts_container').scrollWidth - document.getElementById('piecharts_container').clientWidth;
  $("#rightButton").click(function (event) { 
    var leftPos = $('#piecharts_container').scrollLeft();
    $("#piecharts_container").animate({scrollLeft: leftPos + 200}, 800);
    return;
  });

  $("#leftButton").click(function (event) { 
    var leftPos = $('#piecharts_container').scrollLeft();
    $("#piecharts_container").animate({scrollLeft: leftPos - 200}, 800);
    return;
  });

  $('#piecharts_container').scroll(function(event){
    var leftPos = $('#piecharts_container').scrollLeft();    
    if(leftPos == 0){
      $('img#leftButton.visible').removeClass('visible');
      $('img#leftButton').addClass('hidden');
      return;
    }
    if(leftPos == maxScroll || leftPos == (maxScroll-1)){
      $('#rightButton').removeClass('visible');
      $('#rightButton').addClass('hidden');
      return;
    }
    else{
      $('#leftButton').removeClass('hidden');
      $('#leftButton').addClass('visible');
      $('#rightButton').removeClass('hidden');
      $('#rightButton').addClass('visible');
      return;
    }
  });
}

/*shows tooltip at hover
Determines position is item.seriesIndex. The seriesIndex variable is the index of the data or label in the array. 0 is for top right quadrant, 
1 is for bottom right quadrant, 2 is for bottom left quadrant, and 3 is for top left quadrant. In other words, the index is for each slice of pie, 
determined by clockwise position starting from 12:00 or top middle.
*/
function showTooltip(x, y, label, position) {
        // if( clicksYet )
        //     label += (pointClicked)? ' hello':' bye';

        var tooltipTop = 0, toolTipLeft = 0;
        switch(position)
        {
        case 0:
          tooltipTop = y - 25; 
          toolTipLeft = x + 5;
          break;
        case 1:
          tooltipTop = y + 15; 
          toolTipLeft = x + 5;
          break;
        case 2:
          tooltipTop = y + 25; 
          toolTipLeft = x - 35;
          break;
        case 3:
          tooltipTop = y - 35; 
          toolTipLeft = x - 35;
          break;
        default:
          tooltipTop = y + 25; 
          toolTipLeft = x + 5;
        }

        $('<div id="tooltip">' + label + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: tooltipTop,
            left: toolTipLeft,
            border: '1px solid #fdd',
            padding: '2px',
            'background-color': '#fee',
            opacity: 0.80,
            'z-index': 3
        }).appendTo("body").fadeIn(100);
}


function updatePieCharts() {
  for (var i = 0; i < num_piecharts; i++) {
    var colors = getRandomColors();
    var piedataCopy = piedata;
    for(var j = 0; j < 4; j++){
      piedataCopy[j].color = colors[j];
    }
    $.plot('#pie'+(i+1), piedataCopy, options);
  };
}

function getRandomColors() {
  var rands = new Array(), colors = new Array();
  for(var i = 0; i < 4; i++) {
    rands[i] = Math.random();
  }
  for(var i = 0; i < 4; i++) {
    if(rands[i] >= 0.15) {//green
      colors[i] = { colors: [ "#d3ffaf", "#beff88", "#76ff04", "#84f128", "#9cec57", "#88c257" ] };
    } else if(rands[i] >= 0.05 && rands[i] < 0.15) {//yellow
      colors[i] = { colors: [ "#fdffa9", "#fcff79", "#f4f840", "#f9ff00", "#dde20c", "#aeb211" ] };
    } else {//red
      colors[i] = { colors: [ "#fe9795", "#fe7a78", "#ff3a37", "#f14744", "#fe1d1a", "#b35453" ] };
    }
  }
  return colors;
}

function addMetric(form) {
  var addMetricPanel = $('#addMetric');
  var newMetric = addMetricPanel.prev().clone();
  newMetric.insertAfter(addMetricPanel.prev());
  addMetricPanel.children('.graph-title').removeClass('selected');
  newMetric.children('.graph-title').addClass('selected');
  $('#myModal').modal('hide');
}

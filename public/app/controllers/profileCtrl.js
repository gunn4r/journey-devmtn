angular.module('journey')
.controller('profileCtrl', function($stateParams, $scope, postService, auth, user, $interval,userAverage, mentorAverage, cohortAverage, followingAverage, userPosts, mentorPosts, cohortPosts, followingPosts, userService) {
    
    console.log('userPosts', userPosts);

    //  console.log($scope.postData, "POSTDATA");
    $scope.userInfo = user;
    // $scope.userId = auth.data._id;

    $scope.average = [];
    $scope.count = [];
    if (userAverage) {
        $scope.average[0]= Math.round(userAverage.avg);
        $scope.count[0] = userAverage.count;
     }
    else {
            $scope.average[0] = 0;
            $scope.count[0] = 0;
        }
        if (cohortAverage) {
        $scope.average[1]= Math.round(cohortAverage.avg);
        $scope.count[1] = cohortAverage.count;
     }
    else {
            $scope.average[1] = 0;
            $scope.count[1] = 0;
        }

    if (followingAverage) {
        $scope.average[2]= Math.round(followingAverage.avg);
        $scope.count[2] = followingAverage.count;
     }
    else {
            $scope.average[2] = 0;
            $scope.count[2] = 0;
        }
    if (mentorAverage) {
        $scope.average[3]= Math.round(mentorAverage.avg);
        $scope.count[3] = mentorAverage.count;
     }
    else {
            $scope.average[3] = 0;
            $scope.count[3] = 0;
        }
    // $scope.average[1]= Math.round(cohortAverage.avg);
    // $scope.average[2]= Math.round(followingAverage.avg);
    // $scope.average[3]= Math.round(mentorAverage.avg);

    $scope.durationTitle = ["Past 24 Hours", "Past Week", "Past Month", "All Time"];
    $scope.switchTitle = 1;

    $scope.findEmotionLevel = function(duration){
    $scope.switchTitle = duration;
    $scope.barChartOptions.title.text =                               $scope.durationTitle[$scope.switchTitle] + ' Avg Emotion Level';
    switch (duration) {
       case 0:
            $scope.textDuration = 'day';
            break;
        case 1:
            $scope.textDuration = 'week';
            break;
         case 2:
            $scope.textDuration = 'month';
            break;
         case 3:
            $scope.textDuration = 'allTime';
            break;
   }

    postService.getEmotions($scope.textDuration, user)
        .then(function(response){
            if (response.dataUser.length) {
            $scope.average[0] = Math.round(response.dataUser[0].avg);
            $scope.count[0] = response.dataUser[0].count;
            }
            else {
                $scope.average[0] = 0;
                $scope.count[0] = 0;
            }
            if (response.dataCohort.length) {
            $scope.average[1] = Math.round(response.dataCohort[0].avg);
            $scope.count[1] = response.dataCohort[0].count;
            }
            else {
                $scope.average[1] = 0;
                $scope.count[1] = 0;
            }
            if (response.dataFollowing.length) {
            $scope.average[2] = Math.round(response.dataFollowing[0].avg);
            $scope.count[2] = response.dataFollowing[0].count;
            }
            else {
                $scope.average[2] = 0;
                $scope.count[2] = 0;
            }
            if (response.dataMentor.length) {
            $scope.average[3] = Math.round(response.dataMentor[0].avg);
            $scope.count[3] = response.dataMentor[0].count;
            }
            else {
                $scope.average[3] = 0;
                $scope.count[3] = 0;
            }
            // $scope.average[1] = response.dataCohort;
            // $scope.average[2] = response.dataFollowing;
            // $scope.average[3] = response.dataMentor;
            $scope.barChartData[0].values[0].value = $scope.average[0];
            $scope.barChartData[0].values[1].value = $scope.average[1];
            $scope.barChartData[0].values[2].value = $scope.average[2];
            $scope.barChartData[0].values[3].value = $scope.average[3];
            $scope.barChartData[0].values[0].label = $scope.userInfo.firstName +' (' + $scope.count[0] + ' posts)' ;
            $scope.barChartData[0].values[1].label = 'cohort' +' (' + $scope.count[1] + ' posts)' ;
            $scope.barChartData[0].values[2].label = 'following' +' (' + $scope.count[2] + ' posts)' ;
            $scope.barChartData[0].values[3].label = 'mentor' +' (' + $scope.count[3] + ' posts)' ;

          $scope.api.refresh();

        });
    };



           // DAYS USER HAS BEEN IN PROGRAM
    var a = moment(new Date());
    var b = moment($scope.userInfo.startDate);
    $scope.daysInProgram = a.diff(b, 'days');
    $scope.first = $scope.userInfo.firstName;
    $scope.last = $scope.userInfo.lastName;

    $scope.barChartOptionsObject = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                width: 700, 
                showLegend: true,
                yDomain: [1,10],
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function(d){return d.label;},
                y: function(d){return d.value; },
                showValues: true,
                showLabels: true,

                valueFormat: function(d){
                    return d3.format('.0f')(d);
                },
                duration: 500,
                yAxis: {
                    axisLabel:'Emotion Level',
                    axisLabelDistance: -15,
                    tickFormat:d3.format('.0f'),
                    tickValues:([1,2,3,4,5,6,7,8,9,10]),
                    showMax: true,
                    rotateYLabel: true,

                },


            },
            title: {
                    enable:true,
                    text: $scope.durationTitle[$scope.switchTitle] + ' Avg Emotion Level'
                }
        };



    $scope.barChartDataObject = [
    {
                key: "Cumulative Return",
                values: [
                    {
                        "label" : $scope.userInfo.firstName +' (' + $scope.count[0] + ' posts)' ,
                        "value" : $scope.average[0],

                    } ,
                    {
                        "label" : "cohort" +' (' + $scope.count[1] + ' posts)',
                        "value" : $scope.average[1],

                    } ,
                    {
                        "label" : "following" +' (' + $scope.count[2] + ' posts)' ,
                        "value" : $scope.average[2],

                    } ,
                    {
                        "label" : "mentor" +' (' + $scope.count[3] + ' posts)' ,
                        "value" :$scope.average[3],

                    }

                ]
            }
        ];
    
   
    $scope.barChartOptions = $scope.barChartOptionsObject;

    $scope.barChartData = $scope.barChartDataObject;
    
// D3 line graph options   
    
    var lineGraphData = {
        userPosts: userPosts,
        mentorPosts: mentorPosts, 
        cohortPosts: cohortPosts, 
        followingPosts: followingPosts
    };
    
    var margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y%m%d").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.temperature); });

    var svg = d3.select("div.linechart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .data(lineGraphData);

    color.domain(d3.keys(lineGraphData));

        /* data.forEach(function(d) {
            d.date = parseDate(d.date);
        }); */

    /*var groups = color.domain().map(function(name) {
        return {
            name: name,
            values: lineGraphData.map(function(d) {
                return {
                    date: d.datePosted, 
                    positiveScale: d.positiveScale
                };
            })
        };
    });
*/
    x.domain(d3.extent(lineGraphData, function(d) { return d.datePosted; }));

    y.domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
          
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Positive Scale");

  /*  var group = svg.selectAll(".group")
        .data(groups)
        .enter().append("g")
        .attr("class", "city");

    group.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });

    group.append("text")
        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });
   */
});

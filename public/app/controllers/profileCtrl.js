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
    
// D3 line graph

   /* My data:
  userPosts:
  [
    {
        datePosted: '2016-03-04'
        positiveScale: 7
    },
    {
        datePosted: '2016-03-05'
        positiveScale: 2
    },
  ]
  mentorPosts:
  [
    {
        datePosted: '2016-03-02'
        positiveScale: 3
    },
    {
        datePosted: '2016-03-03'
        positiveScale: 1
    },
  ]
  */
    function drawLineChart() {
        
        var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse;
    // Put data into single array variable
        var lineGraphData = [];
        for (var i = 0; i < userPosts.length; i++) {
            lineGraphData.push({
                group: 'user',
                datePosted: parseDate(userPosts[i].datePosted),
                positiveScale: userPosts[i].positiveScale
            });
        }
        for (var i = 0; i < mentorPosts.length; i++) {
            lineGraphData.push({
                group: 'mentor',
                datePosted: parseDate(mentorPosts[i].datePosted),
                positiveScale: mentorPosts[i].positiveScale
            });
        }
        for (var i = 0; i < cohortPosts.length; i++) {
            lineGraphData.push({
                group: 'cohort',
                datePosted: parseDate(cohortPosts[i].datePosted),
                positiveScale: cohortPosts[i].positiveScale
            });
        }
        for (var i = 0; i < followingPosts.length; i++) {
            lineGraphData.push({
                group: 'following',
                datePosted: parseDate(followingPosts[i].datePosted),
                positiveScale: followingPosts[i].positiveScale
            });
        }

        console.log('lineGraphData', lineGraphData)


// arrange data based on key
        var transformedData = d3.nest()
                        .key(function(d) {return d.group;})
                        .entries(lineGraphData);

        console.log('transformed data', transformedData);

        var color = d3.scale.category10();
        var vis = d3.select("#linechart"),
            WIDTH = 1000,
            HEIGHT = 500,
            MARGINS = {
                top: 50,
                right: 20,
                bottom: 50,
                left: 50
            },
            lSpace = WIDTH/transformedData.length,
            xScale = d3.time.scale()
                .range([MARGINS.left, WIDTH - MARGINS.right])
                .domain([d3.min(transformedData, function(d) {
                    return d.datePosted;
                }), d3.max(lineGraphData, function(d) {
                    return d.datePosted;
                })]),
            yScale = d3.scale.linear()
                .range([HEIGHT - MARGINS.top, MARGINS.bottom])
                .domain([1, 10]),
            xAxis = d3.svg.axis()
                .scale(xScale),
            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");

        vis.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .call(xAxis);
        vis.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (MARGINS.left) + ",0)")
            .call(yAxis);

        var lineGen = d3.svg.line()
            .x(function(d) {
                return xScale(d.datePosted);
            })
            .y(function(d) {
                return yScale(d.positiveScale);
            })
            .interpolate("basis");
        
        transformedData.forEach(function(d,i) {
            
         /*   vis.append('svg:path')
                .attr('d', lineGen(d.values))
                .attr('stroke', function(d,j) { 
                        return "hsl(" + Math.random() * 360 + ",100%,50%)";
                })
                .attr('stroke-width', 2)
                .attr('id', 'line_'+d.key)
                .attr('fill', 'none'); */
            
            vis.append("text")
                .attr("x", (lSpace/2)+i*lSpace)
                .attr("y", HEIGHT)
                .style("fill", "black")
                .attr("class","legend")
                .text(d.key);
            });

        }

        drawLineChart();

});

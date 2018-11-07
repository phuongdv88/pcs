uploadFileHtml = $("#uploadFileModal").html();
changePasswordModalHtml = $("#changePassModal").html();

$(document).ready(function () {
    //$('#bs-task-management').on('shown.bs.tab', function () {
        generateChart();
        //$('#task-management').off();
    //})
    // reset modal when hidden them
    $("#uploadFileModal").on('hidden.bs.modal', function () {
        $("#uploadFileModal").html(uploadFileHtml);
    })

    $("#changePassModal").on('hidden.bs.modal', function () {
        $("#changePassModal").html(changePasswordModalHtml);
    })

    Number.prototype.padLeft = function (base, chr) {
        var len = (String(base || 10).length - String(this).length) + 1;
        return len > 0 ? new Array(len).join(chr || '0') + this : this;
    }
});

function formatDate(inputStr) {
    var d = new Date(parseInt(inputStr));
    dformat = [d.getFullYear().padLeft(),
              (d.getMonth() + 1).padLeft(),
              d.getDate().padLeft()].join('/') + ' ' +
              [d.getHours().padLeft(),
              d.getMinutes().padLeft(),
              d.getSeconds().padLeft()].join(':');
    return dformat;
}
function setUserLoginName(userName) {
    $("#UserName").val(userName);
}
function getAvailableCandidate() {
    $('#candidates').DataTable().clear();
    $('#candidates').DataTable().destroy();
    $.ajax({
        url: '/Specialist/GetAvailableCandidate',
        //data: '{id: ' + id + ' }',
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            var html = '';
            var i = 0;
            $.each(result, function (key, item) {
                i++;
                var candidateName = item.FirstName + " " + item.MiddleName + " " + item.LastName;
                if (item.MiddleName === null) {
                    candidateName = item.FirstName + " " + item.LastName;
                }

                html += '<tr>';
                html += '<td>' + i + '</td>';
                html += '<td>' + candidateName + '</td>';
                html += '<td>' + item.Email + '</td>';
                html += '<td>' + item.PhoneNumber + '</td>';
                html += '<td>' + item.Status + '</td>';
                html += '<td>' + formatDate(item.CreatedTime.substr(6)) + '</td>';
                if (item.CompleteTime == undefined || (item.Status !== 'Completed' && item.Status !== 'Closed')) {
                    html += '<td></td>';
                }
                else {
                    html += '<td>' + formatDate(item.CompleteTime.substr(6)) + '</td>';
                }
                if (item.Status === "Initial") {
                    html += '<td style="text-align: center; vertical-align: middle;"><a href="#" onClick="return assignMe(' + item.CandidateId + ')" class="fas fa-hand-point-up" title="Assign to me"></a></td>';
                } else {
                    html += '<td></td>';
                }
                //html += '<td><a href="#" onClick="return getUploadFileForm(' + item.CandidateId + ')" class="fas fa-pencil-alt" title="View detail"></a></td>';
                html += '</tr>';
            });
            $('#candidates tbody').html(html);
            $('#candidates').DataTable()

        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function getMyCandidate() {
    $('#myTask').DataTable().clear();
    $('#myTask').DataTable().destroy();
    $.ajax({
        url: '/Specialist/GetMyCandidate',
        //data: '{id: ' + id + ' }',
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            var html = '';
            var i = 0;
            $.each(result, function (key, item) {
                i++;
                var candidateName = item.FirstName + " " + item.MiddleName + " " + item.LastName;
                if (item.MiddleName === null) {
                    candidateName = item.FirstName + " " + item.LastName;
                }

                html += '<tr>';
                html += '<td>' + i + '</td>';
                html += '<td>' + item.ClientName + '</td>';
                html += '<td>' + candidateName + '</td>';
                html += '<td>' + item.Email + '</td>';
                html += '<td>' + item.PhoneNumber + '</td>';
                html += '<td>' + item.Status + '</td>';
                html += '<td>' + formatDate(item.CreatedTime.substr(6)) + '</td>';
                if (item.CompleteTime == undefined || (item.Status !== 'Completed' && item.Status !== 'Closed')) {
                    html += '<td></td>';
                }
                else {
                    html += '<td>' + formatDate(item.CompleteTime.substr(6)) + '</td>';
                }
                html += '<td style="text-align: center; vertical-align: middle;"><a href="#" onClick="return _getCandidateEmailInfoById(' + item.CandidateId + ', \'' + candidateName + '\')" class="fas fa-envelope" title="Email to Candidate"></a><span>&nbsp;&nbsp;|&nbsp;&nbsp;</span><a href="/Specialist/ProcessBackgroundCheckCandidate/' + item.CandidateId + '" class="fas fa-user-check" title="Process Background Checks"></a></td>';
                html += '</tr>';
            });
            $('#myTask tbody').html(html);
            $('#myTask').DataTable();
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function assignMe(canId) {
    $.ajax({
        url: '/Specialist/AssignMe/' + canId,
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        async: true,
        success: function (rs) {
            if (rs.result == -1) {
                alert(rs.msg);
            } else {
                $('#btnRefresh').click();
                $('#btnRefreshmyTask').click();
            }
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function _getCandidateReportById(id) {
    $.ajax({
        url: '/Specialist/GetCandidateReport/' + id,
        type: 'Get',
        contentType: "json",
        timeout: '5000',
        success: function (result) {
            //$('#candiateInfoModal').modal('show');
            alert('Show info or view pdf file from' + result.link);
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function _getCandidateById(id) {
    modalHtml = $("#newCandidateModal").html();
    $.ajax({
        url: '/Specialist/GetCandidate/' + id,
        type: 'Get',
        contentType: "json",
        timeout: '5000',
        success: function (result) {
            $('#candidateId').val(result.CandidateId);
            $('#firstName').val(result.FirstName);
            $('#middleName').val(result.MiddleName);
            $('#lastName').val(result.LastName);
            $('#email').val(result.Email);
            $('#phoneNumber').val(result.PhoneNumber);
            $('#jobTitle').val(result.JobTitle);
            $('#jobLevel').val(result.JobLevel);
            $('#newCandidateModal').modal('show');
            $('#btnAdd').text("Update");
            $("#formNewEditCandidate").attr("onsubmit", "_edit(); return false;");
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function _getCandidateEmailInfoById(id, candidateName) {
    $.ajax({
        url: '/Specialist/GetCandidateInfo/' + id,
        type: 'Get',
        contentType: "json",
        success: function (result) {
            $('#candidateName').text(candidateName);
            $('#userNameInfo').text(result.UserName); // need to update to db the field userName, password of candiate table
            $('#passwordRaw').text(result.PasswordRaw);
            if (result.LockoutDateUtc == undefined) {
                $('#lockoutDateUtc').text('N/A'); // 5day from created date
            } else {
                $('#lockoutDateUtc').text(formatDate(result.LockoutDateUtc.substr(6))); // 5day from created date
            }

            $('#candiateEmailInfoModal').modal('show');
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}
function generateChart() {
    $.ajax({
        url: '/Specialist/GetReportForChart',
        type: 'Get',
        contentType: "json",
        success: function (rs) {

            document.getElementById("textchart").innerHTML = "Statistics By Month";
            var dataRegistered = [];
            var res1 = rs.RegisterArray.split(",");
            for (var i = 0; i < res1.length; i++) {
                dataRegistered.push(parseInt(res1[i], 10));
            }

            var dataCompleted = [];
            var res2 = rs.CompleteArray.split(",");
            for (var i = 0; i < res2.length; i++) {
                dataCompleted.push(parseInt(res2[i], 10));
            }
            var areaChartData = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [
                    {
                        //label: 'Electronics',
                        fillColor: 'rgb(255, 51, 102)',
                        strokeColor: 'rgb(255, 51, 102)',
                        pointColor: 'rgb(255, 51, 102)',
                        pointStrokeColor: '#c1c7d1',
                        pointHighlightFill: '#fff',
                        pointHighlightStroke: 'rgba(220,220,220,1)',
                        //data: [65, 59, 80, 81, 56, 55, 80, 80, 81, 56, 55, 80]
                        data: dataRegistered
                    },
                    {
                        //label: 'Digital Goods',
                        fillColor: 'rgba(60,141,188,0.9)',
                        strokeColor: 'rgba(60,141,188,0.8)',
                        pointColor: '#3b8bba',
                        pointStrokeColor: 'rgba(60,141,188,1)',
                        pointHighlightFill: '#fff',
                        pointHighlightStroke: 'rgba(60,141,188,1)',
                        //data: [28, 48, 40, 19, 86, 27, 90, 40, 19, 86, 27, 90]
                        data: dataCompleted
                    }
                ]
            };
            var barChartOptions = {
                //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
                scaleBeginAtZero: true,
                //Boolean - Whether grid lines are shown across the chart
                scaleShowGridLines: true,
                //String - Colour of the grid lines
                scaleGridLineColor: 'rgba(0,0,0,.05)',
                //Number - Width of the grid lines
                scaleGridLineWidth: 1,
                //Boolean - Whether to show horizontal lines (except X axis)
                scaleShowHorizontalLines: true,
                //Boolean - Whether to show vertical lines (except Y axis)
                scaleShowVerticalLines: true,
                //Boolean - If there is a stroke on each bar
                barShowStroke: true,
                //Number - Pixel width of the bar stroke
                barStrokeWidth: 2,
                //Number - Spacing between each of the X value sets
                barValueSpacing: 5,
                //Number - Spacing between data sets within X values
                barDatasetSpacing: 1,
                //String - A legend template
                legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
                //Boolean - whether to make the chart responsive
                responsive: true,
                maintainAspectRatio: true
            };
            //-------------

            var barChartCanvas = $('#barChart').get(0).getContext('2d');
            var barChart = new Chart(barChartCanvas);
            var barChartData = areaChartData;
            barChartData.datasets[1].fillColor = '#3366ff';
            barChartData.datasets[1].strokeColor = '#3366ff';
            barChartData.datasets[1].pointColor = '#3366ff';
            barChartOptions.datasetFill = false;
            barChart.Bar(barChartData, barChartOptions);
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });

}



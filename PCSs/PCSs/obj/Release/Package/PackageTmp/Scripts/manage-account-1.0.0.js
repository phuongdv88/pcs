var currentRecruiterId = -1;

modalHtml = $("#newCandidateModal").html();
changePasswordModalHtml = $("#changePassModal").html();

$(document).ready(function () {
    //_getAllCandidate();
    $('#bs-report-management').on('shown.bs.tab', function () {
        generateChart();
        //$('#report-management').off();
    })
    // reset modal when hidden them
    $("#newCandidateModal").on('hidden.bs.modal', function () {
        $("#newCandidateModal").html(modalHtml);
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
function _setCurrentRecruitId(id) {
    currentRecruiterId = id;
}

function setUserLoginName(userName) {
    $("#UserName").val(userName);
}
function _getAllCandidate(id) {
    $.ajax({
        url: '/Client/GetAllCandidate/' + id,
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
                    html += '<td style="text-align: center; vertical-align: middle;"><a href="#" onClick="return _getCandidateById(' + item.CandidateId + ')" class="fas fa-edit" title="Edit"></a><span>&nbsp;&nbsp;|&nbsp;&nbsp;</span><a href="#" onClick="return deleteCandidate(' + item.CandidateId + ')" class="fas fa-trash-alt" title="Remove"></a></td>';
                } else {
                    html += '<td></td>';
                }


                html += '</tr>';
            });
            $('#candidates tbody').html(html);
            $('#candidates').DataTable();

        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function _getAllCandidateReport(id) {
    $.ajax({
        url: '/Client/GetAllCandidateCompleted/' + id,
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
                if (item.CompleteTime == undefined) {
                    html += '<td>N/A</td>';
                }
                else {
                    html += '<td>' + formatDate(item.CompleteTime.substr(6)) + '</td>';
                }
                html += '<td style="text-align: center; vertical-align: middle;"><a href="#" onClick="return _getCandidateReportById(' + item.CandidateId + ')" class="fas fa-file-download"></a></td>';
                html += '</tr>';
            });
            $('#report tbody').html(html);
            $('#report').DataTable();

        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function _getCandidateReportById(id) {

    window.open('/Client/GetCandidateReportPdf/' + id);
}
function _getCandidateById(id) {
    modalHtml = $("#newCandidateModal").html();
    $.ajax({
        url: '/Client/GetCandidate/' + id,
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
/// generate information that is including user name and password of candidate
//function _getCandidateInfoById(id, candidateName) {
//    $.ajax({
//        url: '/Client/GetCandidateInfo/' + id,
//        type: 'Get',
//        contentType: "json",
//timeout: '5000',
//        success: function (result) {
//            $('#candidateName').text(candidateName);
//            $('#userNameInfo').text(result.UserName); // need to update to db the field userName, password of candiate table
//            $('#passwordRaw').text(result.PasswordRaw);
//            if (result.LockoutDateUtc == undefined) {
//                $('#lockoutDateUtc').text('N/A'); // 5day from created date
//            } else {
//                $('#lockoutDateUtc').text(formatDate(result.LockoutDateUtc.substr(6))); // 5day from created date
//            }

//            $('#candiateInfoModal').modal('show');
//        },
//        error: function (errorMessage) {
//            alert(errorMessage.responseText);
//        }
//    });
//    return false;
//}

function _add() {
    var obj = {
        CandidateId: '0',
        FirstName: $('#firstName').val(),
        MiddleName: $('#middleName').val(),
        LastName: $('#lastName').val(),
        Email: $('#email').val(),
        PhoneNumber: $('#phoneNumber').val(),
        JobTitle: $('#jobTitle').val(),
        JobLevel: $('#jobLevel').val(),
        CurrentRecruiterId: currentRecruiterId
    }

    $.ajax({
        url: '/Client/CreateCandidate',
        data: JSON.stringify(obj),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            $('#btnRefresh').click();
            $("#newCandidateModal").modal('hide');
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function _edit() {
    var obj = {
        CandidateId: $('#candidateId').val(),
        FirstName: $('#firstName').val(),
        MiddleName: $('#middleName').val(),
        LastName: $('#lastName').val(),
        Email: $('#email').val(),
        PhoneNumber: $('#phoneNumber').val(),
        JobTitle: $('#jobTitle').val(),
        JobLevel: $('#jobLevel').val(),
        CurrentRecruiterId: currentRecruiterId
    }

    $.ajax({
        url: '/Client/UpdateCandidate',
        data: JSON.stringify(obj),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            $('#btnRefresh').click();
            $("#newCandidateModal").modal('hide');
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function getProfile() {
    $.ajax({
        url: '/Client/GetRecruiterProfile',
        type: 'Get',
        contentType: "json",
        timeout: '5000',
        success: function (result) {
            $('#recruiterFirstName').val(result.FirstName);
            $('#recruiterMiddleName').val(result.MiddleName);
            $('#recruiterLastName').val(result.LastName);
            $('#recruiterEmail').val(result.Email);
            $('#recruiterPhoneNumber').val(result.PhoneNumber);
            $('#changeProfileModal').modal('show');
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
}

function editProfile() {
    var obj = {
        FirstName: $('#recruiterFirstName').val(),
        MiddleName: $('#recruiterMiddleName').val(),
        LastName: $('#recruiterLastName').val(),
        Email: $('#recruiterEmail').val(),
        PhoneNumber: $('#recruiterPhoneNumber').val(),
    }

    $.ajax({
        url: '/Client/UpdateRecruiterProfile',
        data: JSON.stringify(obj),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            $("#changeProfileModal").modal('hide');
            // update profile and title
            $("#welcomeUser").text("Welcome " + result.msg);
            $("#title").text(result.msg);
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function updatePassword() {
    var obj = {
        OldPassword: $('#oldPassword').val(),
        NewPassword: $('#newPassword').val(),
    }

    $.ajax({
        url: '/Client/UpdatePassword',
        data: JSON.stringify(obj),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (rs) {
            if (rs.result == -1) {
                // show error
                $("#changePasswordMessage").text(rs.msg);
            } else {
                $("#changePassModal").modal('hide');
            }
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function deleteCandidate(id) {
    rs = confirm('Are your sure to delete this candidate?');
    if (rs) {
        $.ajax({
            url: '/Client/DeleteCandidate/' + id,
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
                }
            },
            error: function (errorMessage) {
                alert(errorMessage.responseText);
            }
        });
    }
    return false;
}

var password = document.getElementById("newPassword")
  , confirm_password = document.getElementById("confirmPassword");


function validateConfirmPassword() {

    if (password.value != confirm_password.value) {
        confirm_password.setCustomValidity("Passwords Don't Match");
    } else {
        confirm_password.setCustomValidity('');
    }
}

password.onchange = validateConfirmPassword;
confirm_password.onkeyup = validateConfirmPassword;

function generateChart() {
    $.ajax({
        url: '/Client/GetReportForChart',
        type: 'Get',
        contentType: "json",
        timeout: '5000',
        success: function (rs) {
            document.getElementById("textchart").innerHTML = "Number of candidates";
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



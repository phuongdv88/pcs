﻿var currentSpecialistId = -1;
uploadFileHtml = $("#uploadFileModal").html();
changePasswordModalHtml = $("#changePassModal").html();

$(document).ready(function () {
    $('#bs-task-management').on('shown.bs.tab', function () {
        generateChart();
        //$('#task-management').off();
    })
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
    dformat = [d.getHours().padLeft(),
                   d.getMinutes().padLeft(),
                   d.getSeconds().padLeft()].join(':') + ' ' +
                   [d.getDate().padLeft(),
                   (d.getMonth() + 1).padLeft(),
                   d.getFullYear().padLeft()].join('/');
    return dformat;
}
function _setCurrentRecruitId(id) {
    currentSpecialistId = id;
}

function setUserLoginName(userName) {
    $("#UserName").val(userName);
}
function getAvailableCandidate() {
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
                html += '<tr>';
                html += '<td>' + i + '</td>';
                html += '<td>' + candidateName + '</td>';
                html += '<td>' + item.Email + '</td>';
                html += '<td>' + item.PhoneNumber + '</td>';
                html += '<td>' + item.Status + '</td>';
                html += '<td>' + formatDate(item.CreatedTime.substr(6)) + '</td>';
                if (item.CompleteTime == undefined) {
                    html += '<td>N/A</td>';
                }
                else {
                    html += '<td>' + formatDate(item.CompleteTime.substr(6)) + '</td>';
                }
                html += '<td><a href="#" onClick="return getUploadFileForm(' + item.CandidateId + ')"  title="Assign Me"><img src="/Content/Image/assignme.png" </a></td>';
                //html += '<td><a href="#" onClick="return _getCandidateInfoById(' + item.UserLoginId + ' , \'' + candidateName + '\')" class="far fa-calendar-alt"></a></td>';
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

function getUploadFileForm(candidateId) {
    $("#candidateId").val(candidateId);
    $('#uploadFileModal').modal('show');
    return false;
}

function uploadFile() {
    var formdata = new FormData(); //FormData object
    var fileInput = document.getElementById('fileInput');
    //Iterating through each files selected in fileInput
    for (i = 0; i < fileInput.files.length; i++) {
        //Appending each file to FormData object
        formdata.append(fileInput.files[i].name, fileInput.files[i]);
    }
    //Creating an XMLHttpRequest and sending
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/Specialist/UploadReport/' + $("#candidateId").val());
    xhr.send(formdata);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            alert(xhr.responseText);
            $('#uploadFileModal').modal('hide');
        }
    }

    //todo: change state of Candidate to Complete of Close
    return false;
}

function getAllCandidateCompleted() {
    $.ajax({
        url: '/Specialist/GetAllCandidateCompleted',
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
                html += '<tr>';
                html += '<td>' + i + '</td>';
                html += '<td>' + candidateName + '</td>';
                html += '<td>' + item.Email + '</td>';
                html += '<td>' + item.PhoneNumber + '</td>';
                html += '<td>' + item.Status + '</td>';
                html += '<td>' + formatDate(item.CreatedTime.substr(6)) + '</td>';

                if (item.CompleteTime == undefined) {
                    html += '<td>N/A</td>';
                }
                else {
                    html += '<td>' + formatDate(item.CompleteTime.substr(6)) + '</td>';
                }
                html += '<td>' + item.Email + '</td>';

                html += '<td><a href="#" title="Send Email" onClick="return _getCandidateReportById(' + item.UserLoginId + ')"><img  src="/Content/Image/send.png" /></a> <a href="#"  title="Upload" onClick="return _getCandidateReportById(' + item.UserLoginId + ')" ><img id="iconUpload" src="/Content/Image/upload.png" /></a><a href="#" title="Process" onClick="return _getCandidateReportById(' + item.UserLoginId + ')" ><img id="process" src="/Content/Image/processing.png" /></a></td>';
               
                html += '</tr>';
            });
            $('#report tbody').html(html);
            $('#report').DataTable()

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
/// generate information that is including user name and password of candidate
//function _getCandidateInfoById(id, candidateName) {
//    $.ajax({
//        url: '/Specialist/GetCandidateInfo/' + id,
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

//function _edit() {
//    var obj = {
//        CandidateId: $('#candidateId').val(),
//        FirstName: $('#firstName').val(),
//        MiddleName: $('#middleName').val(),
//        LastName: $('#lastName').val(),
//        Email: $('#email').val(),
//        PhoneNumber: $('#phoneNumber').val(),
//        JobTitle: $('#jobTitle').val(),
//        JobLevel: $('#jobLevel').val(),
//        CurrentSpecialistId: currentSpecialistId
//    }

//    $.ajax({
//        url: '/Specialist/UpdateCandidate',
//        data: JSON.stringify(obj),
//        type: 'POST',
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//timeout: '5000',
//        success: function (result) {
//            $('#btnRefresh').click();
//            $("#newCandidateModal").modal('hide');
//        },
//        error: function (errorMessage) {
//            alert(errorMessage.responseText);
//        }
//    });
//    return false;
//}

function getProfile() {
    $.ajax({
        url: '/Specialist/GetSpecialistProfile',
        type: 'Get',
        contentType: "json",
        timeout: '5000',
        success: function (result) {
            $('#specialistFirstName').val(result.FirstName);
            $('#specialistMiddleName').val(result.MiddleName);
            $('#specialistLastName').val(result.LastName);
            $('#specialistEmail').val(result.Email);
            $('#specialistPhoneNumber').val(result.PhoneNumber);
            $('#changeProfileModal').modal('show');
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
}

function editProfile() {
    var obj = {
        FirstName: $('#specialistFirstName').val(),
        MiddleName: $('#specialistMiddleName').val(),
        LastName: $('#specialistLastName').val(),
        Email: $('#specialistEmail').val(),
        PhoneNumber: $('#specialistPhoneNumber').val(),
    }

    $.ajax({
        url: '/Specialist/UpdateSpecialistProfile',
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
        url: '/Specialist/UpdatePassword',
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
        url: '/Specialist/GetReportForChart',
        type: 'Get',
        contentType: "json",
        timeout: '5000',
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



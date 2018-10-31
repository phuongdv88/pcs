var currentRecruiterId = -1;


var limitCompany = 3; // max company
var countCompany = 0; //counter of company
var lastIndexCompany = 0; // index of company to manage add, remove company
var listDeleteCompanyId = [];
var lastSubmit = false;

$(document).ready(function () {
    //_getAllCandidate();
    $('#bs-report-management').on('shown.bs.tab', function () {
        generateChart();
        //$('#report-management').off();
    })
    // reset modal when hidden them
    $("#newCandidateModal").on('hidden.bs.modal', function () {
        $("#newCandidateModal").html(modalHtml);
        countCompany = 0; //counter of company
        lastIndexCompany = 0; // index of company to manage add, remove company
        listDeleteCompanyId.length = 0;
        lastSubmit = false;
    })

    $("#changePassModal").on('hidden.bs.modal', function () {
        $("#changePassModal").html(changePasswordModalHtml);
    })
    Number.prototype.padLeft = function (base, chr) {
        var len = (String(base || 10).length - String(this).length) + 1;
        return len > 0 ? new Array(len).join(chr || '0') + this : this;
    }

    changePasswordModalHtml = $("#changePassModal").html();
    baseFormCompanyHtml = $("#baseFormCompany").html();
    $("#baseFormCompany").remove();
    modalHtml = $("#newCandidateModal").html();

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
function formatMonthOnly(inputStr) {
    var d = new Date(parseInt(inputStr));
    dformat = [(d.getMonth() + 1).padLeft(), d.getFullYear().padLeft()].join('/');
    return dformat;
}
function _setCurrentRecruitId(id) {
    currentRecruiterId = id;
}

function setUserLoginName(userName) {
    $("#UserName").val(userName);
}
function _getAllCandidate() {
    $.ajax({
        url: '/Client/GetAllCandidate',
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

function getAllCandidateCompleted() {
    $.ajax({
        url: '/Client/GetAllCandidateCompleted',
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
            $("#formNewEditCandidate").attr("onsubmit", "submitData(false); return false;");

            getAllCompany(result.CandidateId);
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}
function addCandidate() {
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
            if (result.rs != -1) {
                $('#btnRefresh').click();
                $("#newCandidateModal").modal('hide');

                // Get all company id by class
                var comFormIdArray = $(".companyClass").map(function () { return this.id });
                $.each(comFormIdArray, function (index, value) {
                    submitCompany(value, result.rs);
                });
                $.each(listDeleteCompanyId, function (index, value) {
                    deleteCompany(value);
                });
                listDeleteCompanyId.length = 0;
            } else alert(result.msg);

        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function editCandidate() {
    var obj = {
        CandidateId: $('#candidateId').val(),
        FirstName: $('#firstName').val(),
        MiddleName: $('#middleName').val(),
        LastName: $('#lastName').val(),
        Email: $('#email').val(),
        PhoneNumber: $('#phoneNumber').val(),
        JobTitle: $('#jobTitle').val(),
        JobLevel: $('#jobLevel').val(),
    }

    $.ajax({
        url: '/Client/UpdateCandidate',
        data: JSON.stringify(obj),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            if (result.rs != -1) {
                // Get all company id by class
                var comFormIdArray = $(".companyClass").map(function () { return this.id });
                $.each(comFormIdArray, function (index, value) {
                    submitCompany(value, result.rs);
                });
                $.each(listDeleteCompanyId, function (index, value) {
                    deleteCompany(value);
                });
                listDeleteCompanyId.length = 0;
                $('#btnRefresh').click();
                $("#newCandidateModal").modal('hide');
            } else alert(result.msg);
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return -1;
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


function generateCompanyHtml(comIndex) {
    var comHtml = baseFormCompanyHtml.replace(/_comId/g, comIndex);
    return comHtml;
}

function newCandidate() {
    addCompany(true);
    $('#newCandidateModal').modal('show');
    return false;
}

function addCompany(isTheFirstOne) {
    lastIndexCompany++;
    countCompany++;
    if (countCompany >= limitCompany) {
        $("#add-company-button").prop("hidden", true);
    }
    var comFormId = "company-base-info" + lastIndexCompany;
    var comHtml = generateCompanyHtml(lastIndexCompany);
    $("#company-information").append(comHtml);
    $("#company-information").find('#' + comFormId).addClass("companyClass"); // add class for company base form
    //Date picker
    $("#company-information").find('#' + comFormId).find('#startDate').datepicker({
        autoclose: true,
        format: "mm-yyyy",
        startView: "years",
        minViewMode: "months"
    });
    $("#company-information").find('#' + comFormId).find('#stopDate').datepicker({
        autoclose: true,
        format: "mm-yyyy",
        startView: "years",
        minViewMode: "months"
    })
    if (isTheFirstOne) {
        $("#company-information").find('#' + comFormId).find("#button-remove-company").remove();
    }
    return comFormId;
}
function removeCompany(comFormId) {
    // add to list of deleted company
    id = $("#" + comFormId).find("#companyId").val();
    if (id !== '-1') {
        listDeleteCompanyId.push(id);
    }
    $("#" + comFormId).remove(); // todo: need to confirm first
    countCompany--;
    if (countCompany < limitCompany) {
        $("#add-company-button").prop("hidden", false);
    }
    return false;
}

function getAllCompany(id) {
    $.ajax({
        url: '/Client/GetAllCompany/' + id,
        type: "GET",
        contenttype: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            var html = '';
            var i = 0;
            $.each(result, function (key, item) {

                // fill up company info
                // generate html of company form
                var comFormId = "";
                if (i == 0) {
                    comFormId = addCompany(true);
                } else {
                    comFormId = addCompany(false);
                }
                // fill data to the form
                $('#' + comFormId).find("#companyId").val(item.CompanyInfoId);
                $('#' + comFormId).find("#companyName").val(item.Name);
                $('#' + comFormId).find("#companyAddress").val(item.Address);
                $('#' + comFormId).find("#companyWebsite").val(item.Website);
                $('#' + comFormId).find("#companyJobTitle").val(item.Jobtitle);
                $('#' + comFormId).find("#startDate").val(formatMonthOnly(item.StartDate.substr(6)));
                $('#' + comFormId).find("#stopDate").val(formatMonthOnly(item.StopDate.substr(6)));
                $('#' + comFormId).find("#jobDuties").val(item.JobDuties);
                i++;
            });
            if (i === 0) {
                addCompany(true);
            }

        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        },
    });
    return false;
};
function newCompany(comFormId, candidateId) {
    var obj = {
        StartDate: $("#" + comFormId).find('#startDate').val(),
        StopDate: $("#" + comFormId).find('#stopDate').val(),
        Jobtitle: $("#" + comFormId).find('#companyJobTitle').val(),
        Name: $("#" + comFormId).find('#companyName').val(),
        Address: $("#" + comFormId).find('#companyAddress').val(),
        Website: $("#" + comFormId).find('#companyWebsite').val(),
        JobDuties: $("#" + comFormId).find('#jobDuties').val(),
        CandidateId: candidateId
    };
    $.ajax({
        url: '/Client/CreateCompany',
        data: JSON.stringify(obj),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (rs) {
            if (rs.rs === -1) {
                alert(rs.msg);
            }
        },
        error: function (rs) {
            alert(rs.responseText);
        },
    });
    return false;
}
function editCompany(comFormId, comId, candidateId) {
    var obj = {
        CompanyInfoId: $("#" + comFormId).find('#companyId').val(),
        StartDate: $("#" + comFormId).find('#startDate').val(),
        StopDate: $("#" + comFormId).find('#stopDate').val(),
        Jobtitle: $("#" + comFormId).find('#companyJobTitle').val(),
        Name: $("#" + comFormId).find('#companyName').val(),
        Address: $("#" + comFormId).find('#companyAddress').val(),
        Website: $("#" + comFormId).find('#companyWebsite').val(),
        JobDuties: $("#" + comFormId).find('#jobDuties').val(),
        CandidateId: candidateId,
    };
    $.ajax({
        url: '/Client/EditCompany',
        data: JSON.stringify(obj),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (rs) {
            if (rs.rs === -1) {
                alert(rs.msg);
            }
        },
        error: function (rs) {
            alert(rs.responseText);
        }
    });
    return false;
}
function deleteCompany(comId) {
    //var cf = confirm('Are you sure want to delete this company?')
    //if (cf) {
    $.ajax({
        url: '/Client/DeleteCompany/' + comId,
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        async: true,
        success: function (result) {
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    //}
}

function submitCompany(comFormId, candidateId) {
    var comId = $("#" + comFormId).find("#companyId").val();
    if (comId === '-1') {
        comId = newCompany(comFormId, candidateId);
    } else {
        editCompany(comFormId, comId, candidateId);
    }
}

function submitData(isNew) {
    lastSubmit = true;
    $("#btnAdd").attr("disabled", "disabled");
    var candidateId = -1;
    if (isNew) {
        candidateId = addCandidate(); // add candidate or update candidate
    } else {
        candidateId = editCandidate();

    }
   
}

$(document).ajaxStop(function () {
    if (lastSubmit) {
        lastSubmit = false;
        // goto login link
        //window.location.href = "/Home/Login";
    }
});
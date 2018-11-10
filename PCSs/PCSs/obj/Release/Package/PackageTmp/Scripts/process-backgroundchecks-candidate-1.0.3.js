$(function () {

});
var uploadFileHtml = $("#uploadFileModal").html();
var logActivityHtml = $("#logActivityModal").html();
var comBaseHtml = $("#companybase").html();
var currentCandidateId = -1;
$(document).ready(function () {


    $("#companybase").remove();
    $("#uploadFileModal").on('hidden.bs.modal', function () {
        $("#uploadFileModal").html(uploadFileHtml);
    })
    $("#logActivityModal").on('hidden.bs.modal', function () {
        $("#logActivityModal").html(logActivityHtml);
    });

    
});
function getCandidateId(candidateId) {
    $.ajax({
        url: '/Specialist/GetCandidateById/' + candidateId,
        type: "GET",
        contenttype: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            if (result.rs !== -1) {
                var candidateName = result.FirstName + ' ' + result.MiddleName + ' ' + result.LastName;
                if (result.MiddleName === undefined) {
                    candidateName = result.FirstName + ' ' + result.LastName;
                }
                // fill data to the form
                $('#candidateFullName').text(candidateName);
                $('#candidateGender').text(result.Gender);
                $('#candidatePhone').text(result.PhoneNumber);
                $('#candidateEmail').text(result.Email);
                $('#candidateDOB').text(result.DOB);
                $('#candidateIDNumber').text(result.IDNumber);
                $('#candidateJobTitle').text(result.JobTitle);
                $('#candidateJobLevel').text(result.JobLevel);
                $('#candidateAddress').text(result.Address);
                $('#candidateAddress').text(result.Address);
                $("#candidateCurrentStatus").text(result.Status);
                currentCandidateId = result.CandidateId;
            }
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        },
    });
    return false;
}

function addCompany(index) {
    $("#companyInformation").append(generateCompany(index));
    var comFormId = 'company' + index;
    var navCom = "<li class>"
    if (index == 0) {
        $("#" + comFormId).addClass("in active");
        navCom = '<li class="active">';
    }
    index++;
    navCom += '<a data-toggle="tab" href="#' + comFormId + '">Company ' + index + ' <i class="" id="iconChecked' + comFormId + '"  style="color:green;"> </i> </a></li>';
    $("#navCompanies").append(navCom)
    return comFormId;
}

function generateCompany(index) {
    var comHtml = comBaseHtml.replace(/_comId/g, index);
    return comHtml;
}

function getAllCompanyInfo(candidateId) {
    $.ajax({
        url: '/Specialist/GetAllCompanyInfo/' + candidateId,
        type: "GET",
        contenttype: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            var html = '';
            var i = 0;
            $.each(result, function (key, item) {
                if (result.rs !== -1) {
                    // fill up company info
                    // generate html of company form
                    var comFormId = addCompany(i);
                    // fill data to the form
                    $('#' + comFormId).find("#companyId_" + comFormId).val(item.CompanyInfoId);
                    $('#' + comFormId).find("#companyWebsite").text(item.Website);
                    $('#' + comFormId).find("#companyAddress").text(item.Address);
                    $('#' + comFormId).find("#companyName").text(item.Name);
                    $('#' + comFormId).find("#companyJobtitle").text(item.Jobtitle);
                    $('#' + comFormId).find("#companyStartDate").text(formatMonthOnly(item.StartDate.substr(6)));
                    $('#' + comFormId).find("#companyStopDate").text(formatMonthOnly(item.StopDate.substr(6)));
                    $('#' + comFormId).find("#companyJobDuties").val(item.JobDuties);
                    $('#' + comFormId).find("#companyNotes").text(item.Note);
                    // fill up checks result
                    if (item.IsChecked) {
                        // add icon check to menu
                        $("#iconChecked" + comFormId).addClass("far fa-check-circle");
                    }
                    if (item.CheckResult !== undefined && item.CheckResult !== null) {
                        var checkresults = item.CheckResult.split(",");
                        if (checkresults.length === 4) {
                            var idresultName = 'name' + String(checkresults[0]).replace('/', '') + '_' + comFormId;
                            var idresultJobTitle = 'jobTitle' + String(checkresults[1]).replace('/', '') + '_' + comFormId;
                            var idresultPeriod = 'period' + String(checkresults[2]).replace('/', '') + '_' + comFormId;
                            var idresultDuties = 'duties' + String(checkresults[3]).replace('/', '') + '_' + comFormId;

                            $("#" + idresultName).iCheck('check');
                            $("#" + idresultJobTitle).iCheck('check');
                            $("#" + idresultPeriod).iCheck('check');
                            $("#" + idresultDuties).iCheck('check');
                            //$('input[name=checkResultName_' + comFormId + ']').find('[val="' + checkresults[0] + '"]').iCheck('check');
                        }
                    }
                    // fill up reference information
                    getAllReference(comFormId, item.CompanyInfoId);
                    i++;
                }
            });
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        },
    });
    return false;
}

function getAllReference(comFormId, comId) {
    $.ajax({
        url: '/Specialist/GetAllReference/' + comId,
        type: "GET",
        contenttype: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            var i = 0;
            var refeFormId = 'referenceForm_0'
            $.each(result, function (key, item) {
                var refeFormId = 'referenceForm_' + i;
                // fill data to the form
                $('#' + comFormId).find("#" + refeFormId).find("#referenceName").text(item.FullName);
                $('#' + comFormId).find("#" + refeFormId).find("#referenceJobTitle").text(item.JobTitle);
                $('#' + comFormId).find("#" + refeFormId).find("#referenceRelationship").text(item.RelationShip);
                $('#' + comFormId).find("#" + refeFormId).find("#referenceEmail").text(item.Email);
                $('#' + comFormId).find("#" + refeFormId).find("#referencePhone").text(item.PhoneNumber);
                i++;
                if (i == 2) {
                    $.break;
                }

            });
            if (i == 1) {
                $('#' + comFormId).find("#referenceForm_1").remove();
            }

        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function updateCandidateStatus(id) {
    var obj = {
        CandidateId: id,
        CandidateStatus: $("#candidateStatusVal").val(),
    };
    $.ajax({
        url: '/Specialist/UpdateCandidateStatus',
        data: JSON.stringify(obj),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.rs !== -1) {
                $("#candidateCurrentStatus").text(obj.CandidateStatus);
                getLogActivities(currentCandidateId);
            } else {
                alert(result.msg);
            }
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function uploadFile(candidateId) {
    var formdata = new FormData(); //FormData object
    var fileInput = document.getElementById('fileInput');
    //Iterating through each files selected in fileInput
    for (i = 0; i < fileInput.files.length; i++) {
        //Appending each file to FormData object
        formdata.append(fileInput.files[i].name, fileInput.files[i]);
    }
    //Creating an XMLHttpRequest and sending
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/Specialist/UploadReport/' + candidateId);
    xhr.send(formdata);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // check success or not?
            if (xhr.rs != -1) {
                getLogActivities(currentCandidateId);
                $("#uploadFileModal").modal('hide');
            } else {
                alert(rs.msg);
            }
        } 
    }
    return false;
}
function logActivity(candidateId) {
    var obj = {
        CandidateId: candidateId,
        ActionType: $("#actionType").val(),
        ActionContent: $("#logNote").val(),
    };
    $.ajax({
        url: '/Specialist/LogActivity',
        data: JSON.stringify(obj),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.rs !== -1) {
                //todo: reload logactivities table
                getLogActivities(currentCandidateId);
                $("#logActivityModal").modal('hide');
            } else {
                alert(result.msg);
            }
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}
function submitCompanyData(comFormId) {
    // get check result to string
    var checkresult = [$('input[name=checkResultName_' + comFormId + ']:checked').val(),
        $('input[name=checkResultJobTitle_' + comFormId + ']:checked').val(),
        $('input[name=checkResultPeriod_' + comFormId + ']:checked').val(),
        $('input[name=checkResultJobDuties_' + comFormId + ']:checked').val()].join(',');

    var obj = {
        CompanyInfoId: $("#" + comFormId).find("#companyId_" + comFormId).val(),
        Note: $("#" + comFormId).find("#companyNotes").val(),
        CheckResult: checkresult,
        CandidateId: currentCandidateId,
    };
    $.ajax({
        url: '/Specialist/UpdateCompanyChecksResult',
        data: JSON.stringify(obj),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.rs !== -1) {
                alert("Submit successfully");
                $("#iconChecked" + comFormId).addClass("far fa-check-circle");
                getLogActivities(currentCandidateId);
            } else {
                alert(result.msg);
            }
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;

}

function getLogActivities(canId) {
    //reset pages index
    $('#logActivites').DataTable().clear();
    $('#logActivites').DataTable().destroy();
    $.ajax({
        url: '/Specialist/GetLogActivities/' + canId,
        type: "GET",
        contenttype: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            var html = '';
            var i = 0;
            $.each(result, function (key, item) {
                i++;

                html += '<tr>';
                html += '<td>' + i + '</td>';
                html += '<td>' + formatDate(item.ActionTime.substr(6)) + '</td>';
                html += '<td>' + item.ActionType + '</td>';
                html += '<td>' + item.ActionContent + '</td>';
                html += '</tr>';
            });
            $('#logActivites tbody').html(html);

            $('#logActivites').DataTable({
                'pageLength':5,
                'paging': true,
                'lengthChange': false,
                'searching': false,
                'ordering': true,
                'info': true,
                'autoWidth': false,
                 "bDestroy": true
            })

        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        },
    });
    return false;
}

function getCandidateReportById(id) {
    window.open('/Specialist/GetCandidateReportPdf/' + id);
}
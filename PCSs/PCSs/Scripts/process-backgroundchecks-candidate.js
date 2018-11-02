$(function () {
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' // optional
    });
});

var comBaseHtml = $("#companybase").html();
$(document).ready(function () {
    $("#companybase").remove();
});
function getCandidateId(candidateId) {
    $.ajax({
        url: '/Specialist/GetCandidateById/' + candidateId,
        type: "GET",
        contenttype: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            if (result.rs !== -1)
            {
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
    navCom += '<a data-toggle="tab" href="#' + comFormId + '">Company ' + index + '</a></li>';    
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
                if (result.rs !== -1)
                {
                    // fill up company info
                    // generate html of company form
                    var comFormId = addCompany(i);
                    // fill data to the form
                    $('#' + comFormId).find("#companyWebsite").text(item.Website);
                    $('#' + comFormId).find("#companyAddress").text(item.Address);
                    $('#' + comFormId).find("#companyName").text(item.Name);
                    $('#' + comFormId).find("#companyJobTitle").text(item.Jobtitle);
                    $('#' + comFormId).find("#companyStartDate").text(formatMonthOnly(item.StartDate.substr(6)));
                    $('#' + comFormId).find("#companyStopDate").text(formatMonthOnly(item.StopDate.substr(6)));
                    $('#' + comFormId).find("#companyJobDuties").val(item.JobDuties);
                    $('#' + comFormId).find("#companyNotes").text(item.Note);

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
            if(i==1){
                $('#' + comFormId).find("#" + refeFormId).remove();
            }
            
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}
function submitCompanyData(comFormId){

}
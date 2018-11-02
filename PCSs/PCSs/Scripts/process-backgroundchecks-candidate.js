$(function () {
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' // optional
    });
});

var comBaseHtml = $("#company_comId").html();
$(document).ready(function () {
    $("#company_comId").remove();
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
    var comFormId = 'company_' + index;
    var navCom = "<li>"
    if (index == 0) {
        $("#" + comFormId).addClass("in active");
        navCom = '<li class="active">';
    }
    index++;
    navCom += '<a data-toggle="tab" href="#' + comFormId + '">Company' + index + '</a></li>';    
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
                    $('#' + comFormId).find("#companyWebsite").val(item.Website);
                    $('#' + comFormId).find("#companyAddress").val(item.Address);
                    $('#' + comFormId).find("#companyName").val(item.Name);
                    $('#' + comFormId).find("#companyJobTitle").val(item.Jobtitle);
                    $('#' + comFormId).find("#companyStartDate").val(formatMonthOnly(item.StartDate.substr(6)));
                    $('#' + comFormId).find("#companyStopDate").val(formatMonthOnly(item.StopDate.substr(6)));
                    $('#' + comFormId).find("#companyJobDuties").val(item.JobDuties);

                    // fill up reference information

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

}
function submitCompanyData(comFormId){

}
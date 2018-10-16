$(function () {
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' // optional
    });
});
Number.prototype.padLeft = function (base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
}


function formatDate(inputStr) {
    var d = new Date(parseInt(inputStr));
    dformat = [(d.getMonth() + 1).padLeft(),
                   d.getFullYear().padLeft()].join('/');
    return dformat;
}

var limitCompany = 3; // max company
var countCompany = 1; //counter of company
var lastIndexCompany = 0; // index of company to manage add, remove company
var currentCandidateId = -1;
var limitReference = 2;
var countReferenceArray = {};
var lastIndexReferenceArray = {};
var listComId = {};

$(document).ready(function () {
    // load company
});

$("#ConfirmSubmit").click(function () {
    $('#buttonSubmit').prop("disabled", $("#cbConfirmSubmit").prop("checked"));
});
function generateCompanyHtml(comIndex) {
    var comHtml = $("#baseFormCompany").html();
    comHtml = comHtml.replace(/_comId/g, comIndex);
    return comHtml;
}

function generateReferenceHtml(refeIndex, comId) {
    var refeHtml = $("#baseReference").html();
    refeHtml = refeHtml.replace(/_refeId/g, refeIndex);
    refeHtml = refeHtml.replace(/company-base-info_comId/g, comId);
    return refeHtml;
}

function addCompany() {
    lastIndexCompany++;
    countCompany++;
    if (countCompany >= limitCompany) {
        $("#add-company-button").prop("hidden", true);
    }
    var comFormId = "company-base-info" + lastIndexCompany;
    countReferenceArray[comFormId] = 0;
    lastIndexReferenceArray[comFormId] = 0;
    var comHtml = generateCompanyHtml(lastIndexCompany);
    $("#company-information").append(comHtml);
    $("#company-information").find('#' + comFormId).prop("hidden", false); // show
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
    return comFormId;
}
function removeCompany(comId) {
    $("#" + comId).remove(); // todo: need to confirm first
    countCompany--;
    if (countCompany < limitCompany) {
        $("#add-company-button").prop("hidden", false);
    }
    return false;
}
function addReference(comId) {
    lastIndexReferenceArray[comId]++;
    countReferenceArray[comId]++;
    if (countReferenceArray[comId] >= limitReference) {
        $('#' + comId).find("#addReferenceButton").prop("hidden", true);
    }
    var refeFormId = "reference-information" + lastIndexReferenceArray[comId];
    var refeHtml = generateReferenceHtml(lastIndexReferenceArray[comId], comId);
    $('#' + comId).find('#referenceInformation').append(refeHtml);
    $('#' + comId).find("#" + refeFormId).find('#btnRemoveReference').prop("hidden", false); // show remove reference button
    $('#' + comId).find("#" + refeFormId).prop("hidden", false);

    return refeFormId;
}
function removeReference(refeId, comId) {
    $('#' + refeId).remove();
    countReferenceArray[comId]--;
    if (countReferenceArray[comId] < limitReference) {
        $('#' + comId).find("#addReferenceButton").prop("hidden", false);
    }
    return false;
}

function getAllCompany(id) {
    currentCandidateId = id;
    $.ajax({
        url: '/Candidate/GetAllCompany/' + id,
        type: "GET",
        contenttype: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '3000',
        success: function (result) {
            var html = '';
            var i = 0;
            $.each(result, function (key, item) {
                // fill up company info
                // generate html of company form
                var comFormId = addCompany();
                // fill data to the form
                $('#' + comFormId).find("#companyId").val(item.CompanyInfoId);
                $('#' + comFormId).find("#companyName").val(item.Name);
                $('#' + comFormId).find("#companyAddress").val(item.Address);
                $('#' + comFormId).find("#companyWebsite").val(item.Website);
                $('#' + comFormId).find("#companyJobTitle").val(item.Jobtitle);
                $('#' + comFormId).find("#startDate").val(formatDate(item.StartDate.substr(6)));
                $('#' + comFormId).find("#stopDate").val(formatDate(item.StopDate.substr(6)));
                // fill up reference every company
                listComId[item.CompanyInfoId] = comFormId;
                
            });
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        },
        complete: function () {
            $.each(listComId, function (key, item) {
                getAllReference(key, item);
            });
        }

    });
    return false;
};

function getAllReference(id, comFormId) {
    $.ajax({
        url: '/Candidate/GetAllReference/' + id,
        type: "GET",
        contenttype: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '3000',
        success: function (result) {
            var html = '';
            var i = 0;
            listComId.lenth = 0;
            $.each(result, function (key, item) {
                // generate html of reference form
                var refeFormId = addReference(comFormId);
                // fill data to the form
                $('#' + comFormId).find("#" + refeFormId).find("#refeId").val(item.ReferenceInfoId);
                $('#' + comFormId).find("#" + refeFormId).find("#refeFullName").val(item.FullName);
                $('#' + comFormId).find("#" + refeFormId).find("#refeJobTitle").val(item.JobTitle);
                $('#' + comFormId).find("#" + refeFormId).find("#refeRelationship").val(item.RelationShip);
                $('#' + comFormId).find("#" + refeFormId).find("#refeEmail").val(item.Email);
                $('#' + comFormId).find("#" + refeFormId).find("#refePhoneNumber").val(item.PhoneNumber);
            });
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        },
        complete: function () {

        }

    });
    return false;
}
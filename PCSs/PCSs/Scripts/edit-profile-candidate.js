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
var countCompany = 0; //counter of company
var lastIndexCompany = 0; // index of company to manage add, remove company
var currentCandidateId = -1;
var limitReference = 2;
var countReferenceArray = {};
var lastIndexReferenceArray = {};
var listComId = {};
var listDeleteCompanyId = [];
var listDeleteReferenceId = [];

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

function generateReferenceHtml(refeIndex, comFormId) {
    var refeHtml = $("#baseReference").html();
    refeHtml = refeHtml.replace(/_refeId/g, refeIndex);
    refeHtml = refeHtml.replace(/company-base-info_comId/g, comFormId);
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
function addReference(comFormId) {
    lastIndexReferenceArray[comFormId]++;
    countReferenceArray[comFormId]++;
    if (countReferenceArray[comFormId] >= limitReference) {
        $('#' + comFormId).find("#addReferenceButton").prop("hidden", true);
    }
    var refeFormId = "reference-information" + lastIndexReferenceArray[comFormId];
    var refeHtml = generateReferenceHtml(lastIndexReferenceArray[comFormId], comFormId);
    $('#' + comFormId).find('#referenceInformation').append(refeHtml);
    $('#' + comFormId).find("#" + refeFormId).find('#btnRemoveReference').prop("hidden", false); // show remove reference button
    $('#' + comFormId).find("#" + refeFormId).prop("hidden", false);
    $('#' + comFormId).find("#" + refeFormId).addClass("referenceClass"); // add class for reference form

    return refeFormId;
}
function removeReference(refeFormId, comFormId) {
    var referenceId = $('#' + comFormId).find("#" + refeFormId).find("#referenceId").val();
    if (referenceId !== -1) {
        listDeleteReferenceId.push(referenceId);
    }
    $('#' + refeFormId).remove();
    countReferenceArray[comFormId]--;
    if (countReferenceArray[comFormId] < limitReference) {
        $('#' + comFormId).find("#addReferenceButton").prop("hidden", false);
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
            listComId.length = 0;
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
        }
    });
    return false;
}

function newCompany(comFormId) {
    var obj = {
        StartDate: $("#" + comFormId).find('#startDate').val(),
        StopDate: $("#" + comFormId).find('#stopDate').val(),
        Jobtitle: $("#" + comFormId).find('#companyJobTitle').val(),
        Name: $("#" + comFormId).find('#companyName').val(),
        Address: $("#" + comFormId).find('#companyAddress').val(),
        Website: $("#" + comFormId).find('#companyWebsite').val(),
    };
    $.ajax({
        url: '/Home/CreateCompany/',
        data: JSON.stringify(obj),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (rs) {
            return rs.responseText;
        },
        error: function (rs) {
            alert(rs.responseText);
        }
    });
}
function editCompany(comFormId) {
    var obj = {
        CompanyInfoId: $("#" + comFormId).find('#companyId').val(),
        StartDate: $("#" + comFormId).find('#startDate').val(),
        StopDate: $("#" + comFormId).find('#stopDate').val(),
        Jobtitle: $("#" + comFormId).find('#companyJobTitle').val(),
        Name: $("#" + comFormId).find('#companyName').val(),
        Address: $("#" + comFormId).find('#companyAddress').val(),
        Website: $("#" + comFormId).find('#companyWebsite').val(),
    };
    $.ajax({
        url: '/Home/EditCompany/',
        data: JSON.stringify(obj),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (rs) {

        },
        error: function (rs) {
            alert(rs.responseText);
        }
    });
}
function deleteCompany(comId) {
    //var cf = confirm('Are you sure want to delete this company?')
    //if (cf) {
    $.ajax({
        url: '/Candidate/DeleteCompany/' + comId,
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (result) {

        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    //}
}

function newReference(refeFormId, comFormId, comId) {
    var obj = {
        FullName: $("#" + comFormId).find("#" + refeFormId).find("#refeFullName").val(),
        RelationShip: $("#" + comFormId).find("#" + refeFormId).find("#refeRelationship").val(),
        JobTitle: $("#" + comFormId).find("#" + refeFormId).find("#refeJobTitle").val(),
        Email: $("#" + comFormId).find("#" + refeFormId).find("#refeEmail").val(),
        PhoneNumber: $("#" + comFormId).find("#" + refeFormId).find("#refePhoneNumber").val(),
        CompanyInfoId: comId,
    };
    $.ajax({
        url: '/Home/CreateReference/',
        data: JSON.stringify(obj),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (rs) {

        },
        error: function (rs) {
            alert(rs.responseText);
        }
    });
}
function editReference(refeFormId, comFormId) {
    var obj = {
        ReferenceInfoId: $("#" + comFormId).find("#" + refeFormId).find("#referenceId").val(),
        FullName: $("#" + comFormId).find("#" + refeFormId).find("#refeFullName").val(),
        RelationShip: $("#" + comFormId).find("#" + refeFormId).find("#refeRelationship").val(),
        JobTitle: $("#" + comFormId).find("#" + refeFormId).find("#refeJobTitle").val(),
        Email: $("#" + comFormId).find("#" + refeFormId).find("#refeEmail").val(),
        PhoneNumber: $("#" + comFormId).find("#" + refeFormId).find("#refePhoneNumber").val(),
        CompanyInfoId: comId,
    };
    $.ajax({
        url: '/Home/EditReference/',
        data: JSON.stringify(obj),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (rs) {

        },
        error: function (rs) {
            alert(rs.responseText);
        }
    });
}
function deleteReference(refeId) {
    $.ajax({
        url: '/Candidate/DeleteReference/' + refeId,
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (result) {

        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
}
$("#updateCandidateForm").submit(function () {

    // Get all company id by class
    var comFormIdArray = $(".companyClass").map(function () { return this.id });
    // if company id == -1 => Create new, return id, else update company
    $.each(comFormIdArray, function (index, value) {
    });
    // for every company:
    // get all reference of company by class

    // if reference id == -1 -> create new, else update reference

    // delete company in list
    // delete reference in list
    return false;
});

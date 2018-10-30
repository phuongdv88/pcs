$(function () {
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' // optional
    });
    ////Red color scheme for iCheck
    //$('input[type="checkbox"].minimal-red, input[type="radio"].minimal-red').iCheck({
    //    checkboxClass: 'icheckbox_minimal-red',
    //})
});

function activeTab(tab) {
    $("#" + tab).addClass("in active");
    $(".tab-pane").not($("#" + tab)).removeClass("in active");
    return false;
}

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
var lastSubmit = false;

$(document).ready(function () {
    // load company
});

$('input').on('ifChecked', function (event) {
    $('#buttonSubmit').prop("disabled", false);
});
$('input').on('ifUnchecked', function (event) {
    $('#buttonSubmit').prop("disabled", true);
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

function addCompany(isNew) {
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
    if (isNew) {
        addReference(comFormId, true)
    }
    return comFormId;
}
function removeCompany(comFormId) {
    // add to list of deleted company
    id = $("#" + comFormId).find("#companyId").val();
    if (id !== '-1') {
        listDeleteCompanyId.push(id);
    }
    // remove related reference
    var refeFormIdArray = $("#" + comFormId).find(".referenceClass").map(function () { return this.id });
    $.each(refeFormIdArray, function (index, value) {
        var referenceId = $('#' + comFormId).find("#" + value).find("#referenceId").val();
        if (referenceId !== '-1') {
            listDeleteReferenceId.push(referenceId);
        }
    })

    $("#" + comFormId).remove(); // todo: need to confirm first
    countCompany--;
    if (countCompany < limitCompany) {
        $("#add-company-button").prop("hidden", false);
    }
    return false;
}
function addReference(comFormId, isTheFirstOne) {
    lastIndexReferenceArray[comFormId]++;
    countReferenceArray[comFormId]++;
    if (countReferenceArray[comFormId] >= limitReference) {
        $('#' + comFormId).find("#addReferenceButton").prop("hidden", true);
    }
    var refeFormId = "reference-information" + lastIndexReferenceArray[comFormId];
    var refeHtml = generateReferenceHtml(lastIndexReferenceArray[comFormId], comFormId);
    $('#' + comFormId).find('#referenceInformation').append(refeHtml);
    if (isTheFirstOne) {
        $('#' + comFormId).find("#" + refeFormId).find('#btnRemoveReference').remove(); // show remove reference button
    } else {
        $('#' + comFormId).find("#" + refeFormId).find('#btnRemoveReference').prop("hidden", false); // show remove reference button
    }
    $('#' + comFormId).find("#" + refeFormId).prop("hidden", false);
    $('#' + comFormId).find("#" + refeFormId).addClass("referenceClass"); // add class for reference form

    return refeFormId;
}
function removeReference(refeFormId, comFormId) {
    var referenceId = $('#' + comFormId).find("#" + refeFormId).find("#referenceId").val();
    if (referenceId !== '-1') {
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
        timeout: '5000',
        success: function (result) {
            var html = '';
            var i = 0;
            $.each(result, function (key, item) {
                // fill up company info
                // generate html of company form
                var comFormId = addCompany(false);
                // fill data to the form
                $('#' + comFormId).find("#companyId").val(item.CompanyInfoId);
                $('#' + comFormId).find("#companyName").val(item.Name);
                $('#' + comFormId).find("#companyAddress").val(item.Address);
                $('#' + comFormId).find("#companyWebsite").val(item.Website);
                $('#' + comFormId).find("#companyJobTitle").val(item.Jobtitle);
                $('#' + comFormId).find("#startDate").val(formatDate(item.StartDate.substr(6)));
                $('#' + comFormId).find("#stopDate").val(formatDate(item.StopDate.substr(6)));
                $('#' + comFormId).find("#jobDuties").val(item.JobDuties);
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
        timeout: '5000',
        success: function (result) {
            var i = 0;
            listComId.length = 0;
            $.each(result, function (key, item) {
                // generate html of reference form
                var refeFormId = "";
                if (i == 0) {
                    refeFormId = addReference(comFormId, true);
                    i++;
                } else {
                    refeFormId = addReference(comFormId, false);
                }
                // fill data to the form
                $('#' + comFormId).find("#" + refeFormId).find("#referenceId").val(item.ReferenceInfoId);
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
        JobDuties: $("#" + comFormId).find('#jobDuties').val(),
    };
    $.ajax({
        url: '/Candidate/CreateCompany/',
        data: JSON.stringify(obj),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (rs) {
            submitReferences(comFormId, rs.comId); // submit all references after submit company
            return rs.responseText;
        },
        error: function (rs) {
            alert(rs.responseText);
        },
    });
}
function editCompany(comFormId, comId) {
    var obj = {
        CompanyInfoId: $("#" + comFormId).find('#companyId').val(),
        StartDate: $("#" + comFormId).find('#startDate').val(),
        StopDate: $("#" + comFormId).find('#stopDate').val(),
        Jobtitle: $("#" + comFormId).find('#companyJobTitle').val(),
        Name: $("#" + comFormId).find('#companyName').val(),
        Address: $("#" + comFormId).find('#companyAddress').val(),
        Website: $("#" + comFormId).find('#companyWebsite').val(),
        JobDuties: $("#" + comFormId).find('#jobDuties').val(),
    };
    $.ajax({
        url: '/Candidate/EditCompany/',
        data: JSON.stringify(obj),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (rs) {
            submitReferences(comFormId, comId); // submit all references after submit company
            return rs.responseText;
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
        url: '/Candidate/CreateReference/',
        data: JSON.stringify(obj),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (rs) {

        },
        error: function (rs) {
            alert(rs.responseText);
        }
    });
}
function editReference(refeFormId, comFormId, comId) {
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
        url: '/Candidate/EditReference/',
        data: JSON.stringify(obj),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
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
        timeout: '5000',
        success: function (result) {

        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
}

function submitCompany(comFormId) {
    var comId = $("#" + comFormId).find("#companyId").val();
    if (comId === '-1') {
        comId = newCompany(comFormId);
    } else {
        editCompany(comFormId, comId);
    }
}
function submitReferences(comFormId, comId) {
    // get all reference of company by class
    var refeFormIdArray = $("#" + comFormId).find(".referenceClass").map(function () { return this.id });
    $.each(refeFormIdArray, function (index, refeFormId) {
        if ($("#" + comFormId).find("#" + refeFormId).find("#referenceId").val() === '-1') {
            newReference(refeFormId, comFormId, comId);
        } else {
            editReference(refeFormId, comFormId, comId);
        }
    })
}

$("#updateCandidateForm").submit(function (e) {

    e.preventDefault();
    lastSubmit = true;
    // Get all company id by class
    var comFormIdArray = $(".companyClass").map(function () { return this.id });
    $.each(comFormIdArray, function (index, value) {
        submitCompany(value);
    });

    $.each(listDeleteReferenceId, function (index, value) {
        deleteReference(value);
    });
    listDeleteReferenceId.length = 0;

    $.each(listDeleteCompanyId, function (index, value) {
        deleteCompany(value);
    });
    listDeleteCompanyId.length = 0;

    //$(this).unbind('submit').submit(); // submit form, before it, ensure all ajax script is finish
});

$(document).ajaxStop(function () {
    if (lastSubmit) {
        $("#updateCandidateForm").unbind('submit').submit(); // submit form, before it, ensure all ajax script is finish
        lastSubmit = false;
    }
});
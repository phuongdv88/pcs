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
    //$("#" + tab).addClass("in active");
    //$(".tab-pane").not($("#" + tab)).removeClass("in active");
    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
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
var baseFormCompanyHtml = "";
var baseReferenceHtml = "";
$(document).ready(function () {
    // load company
    $('#cbConfirmSubmit').on('ifChecked', function (event) {
        $('#buttonSubmit').prop("disabled", false);
    });
    $('cbConfirmSubmit').on('ifUnchecked', function (event) {
        $('#buttonSubmit').prop("disabled", true);
    });

    baseReferenceHtml = $("#baseReference").html();
    $("#baseReference").remove();
    baseFormCompanyHtml = $("#baseFormCompany").html();
    $("#baseFormCompany").remove();

    $("#candidateDOB").datepicker({
        autoclose: true,
        format: "dd/mm/yyyy",
        startView: "years",
        minViewMode: "days"
    });
});

function generateCompanyHtml(comIndex) {
    var comHtml = baseFormCompanyHtml.replace(/_comId/g, comIndex);
    return comHtml;
}

function generateReferenceHtml(refeIndex, comFormId) {
    var refeHtml = baseReferenceHtml.replace(/_refeId/g, refeIndex);
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
    // remove base reference Information
    $('#' + comFormId).find('#baseReference').remove();
    if (isTheFirstOne) {
        $('#' + comFormId).find("#" + refeFormId).find('#btnRemoveReference').remove(); // show remove reference button
    } else {
        $('#' + comFormId).find("#" + refeFormId).find('#btnRemoveReference').prop("hidden", false); // show remove reference button
    }
    $('#' + comFormId).find("#" + refeFormId).addClass("referenceClass"); // add class for reference form

    return refeFormId;
}
function removeReference(refeFormId, comFormId) {
    var referenceId = $('#' + comFormId).find("#" + refeFormId).find("#referenceId").val();
    if (referenceId !== '-1') {
        listDeleteReferenceId.push(referenceId);
    }
    $('#' + comFormId).find('#' + refeFormId).remove();
    countReferenceArray[comFormId]--;
    if (countReferenceArray[comFormId] < limitReference) {
        $('#' + comFormId).find("#addReferenceButton").prop("hidden", false);
    }
    return false;
}

function getCandidateInfo() {
    $.ajax({
        url: '/Candidate/GetCandidateInfo',
        type: "GET",
        contenttype: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            var candidateName = result.FirstName + ' ' + result.MiddleName + ' ' + result.LastName;
            if (result.MiddleName === undefined) {
                candidateName = result.FirstName + ' ' + result.LastName;
            }
            // fill data to the form
            $('#candidatesFullName').val(candidateName);
            if (result.Gender === "Female") {
                $('#female').iCheck('check');
            } else {
                $('#female').iCheck('uncheck');
            }
            $('#candidateEmail').val(result.Email);
            $('#candidatePhoneNumber').val(result.PhoneNumber);
            $('#candidateDOB').val(result.DOB);
            $('#candidateIDNumber').val(result.IDNumber);
            $('#candidateAddress').val(result.Address);

            // fill up reference every company
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
}

function updateCandidateInfo() {
    var gender = "Male";
    if ($("#female").prop('checked') == true) {
        gender = "Female";
    }

    var obj = {
        Gender: gender,
        Email: $.trim($('#candidateEmail').val()),
        PhoneNumber: $.trim($('#candidatePhoneNumber').val()),
        DOB: $.trim($('#candidateDOB').val()),
        IDNumber: $.trim($('#candidateIDNumber').val()),
        Address: $.trim($('#candidateAddress').val()),
    };
    $.ajax({
        url: '/Candidate/UpdateCandidateInfo',
        data: JSON.stringify(obj),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            if (result.rs === -1) {
                alert(result.msg);
            }
        },
        error: function (results) {
            alert(results.responseText);
        }
    });
}

function getAllCompanyCan() {
    $.ajax({
        url: '/Candidate/GetAllCompany',
        type: "GET",
        contenttype: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            var html = '';
            var i = 0;
            $.each(result, function (key, item) {
                i++;
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
            listComId.length = 0; // reset list com id
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
            if (i == 0) {
                refeFormId = addReference(comFormId, true);
            }
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function newCompany(comFormId) {
    var obj = {
        StartDate: $.trim($("#" + comFormId).find('#startDate').val()),
        StopDate: $.trim($("#" + comFormId).find('#stopDate').val()),
        Jobtitle: $.trim($("#" + comFormId).find('#companyJobTitle').val()),
        Name: $.trim($("#" + comFormId).find('#companyName').val()),
        Address: $.trim($("#" + comFormId).find('#companyAddress').val()),
        Website: $.trim($("#" + comFormId).find('#companyWebsite').val()),
        JobDuties: $.trim($("#" + comFormId).find('#jobDuties').val()),
    };
    $.ajax({
        url: '/Candidate/CreateCompany/',
        data: JSON.stringify(obj),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            submitReferences(comFormId, result.comId); // submit all references after submit company
            if (result.rs === -1) {
                alert(resuresult.msg);
            }
        },
        error: function (rs) {
            alert(rs.responseText);
        },
    });
}
function editCompany(comFormId, comId) {
    var obj = {
        CompanyInfoId: $.trim($("#" + comFormId).find('#companyId').val()),
        StartDate: $.trim($("#" + comFormId).find('#startDate').val()),
        StopDate: $.trim($("#" + comFormId).find('#stopDate').val()),
        Jobtitle: $.trim($("#" + comFormId).find('#companyJobTitle').val()),
        Name: $.trim($("#" + comFormId).find('#companyName').val()),
        Address: $.trim($("#" + comFormId).find('#companyAddress').val()),
        Website: $.trim($("#" + comFormId).find('#companyWebsite').val()),
        JobDuties: $.trim($("#" + comFormId).find('#jobDuties').val()),
    };
    $.ajax({
        url: '/Candidate/EditCompany/',
        data: JSON.stringify(obj),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            submitReferences(comFormId, comId); // submit all references after submit company
            if (result.rs === -1) {
                alert(result.msg);
            }
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
        FullName: $.trim($("#" + comFormId).find("#" + refeFormId).find("#refeFullName").val()),
        RelationShip: $.trim($("#" + comFormId).find("#" + refeFormId).find("#refeRelationship").val()),
        JobTitle: $.trim($("#" + comFormId).find("#" + refeFormId).find("#refeJobTitle").val()),
        Email: $.trim($("#" + comFormId).find("#" + refeFormId).find("#refeEmail").val()),
        PhoneNumber: $.trim($("#" + comFormId).find("#" + refeFormId).find("#refePhoneNumber").val()),
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
            if (rs.rs === -1) {
                alert(rs.msg);
            }
        },
        error: function (rs) {
            alert(rs.responseText);
        }
    });
}
function editReference(refeFormId, comFormId, comId) {
    var obj = {
        ReferenceInfoId: $.trim($("#" + comFormId).find("#" + refeFormId).find("#referenceId").val()),
        FullName: $.trim($("#" + comFormId).find("#" + refeFormId).find("#refeFullName").val()),
        RelationShip: $.trim($("#" + comFormId).find("#" + refeFormId).find("#refeRelationship").val()),
        JobTitle: $.trim($("#" + comFormId).find("#" + refeFormId).find("#refeJobTitle").val()),
        Email: $.trim($("#" + comFormId).find("#" + refeFormId).find("#refeEmail").val()),
        PhoneNumber: $.trim($("#" + comFormId).find("#" + refeFormId).find("#refePhoneNumber").val()),
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
            if (rs.rs === -1) {
                alert(rs.msg);
            }
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
function submitData() {
    lastSubmit = true;
    // update Candidate
    updateCandidateInfo();
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
}

$(document).ajaxStop(function () {
    if (lastSubmit) {
        lastSubmit = false;
        // goto login link
        window.location.href = "/Home/Login";
    }
});
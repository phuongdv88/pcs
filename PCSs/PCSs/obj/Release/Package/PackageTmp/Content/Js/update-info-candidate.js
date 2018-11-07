$(function () {
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' // optional
    });
});

var limitCompany = 3; // max references
var countCompany = 1; //counter of references
var indexCompany = 0; //counter of references

$(document).ready(function ()
{
});

function updateCompanyCount(numberCom, indexCom){
    countCompany = numberCom;
    indexCompany = indexCom;
}


function addReference(indexCompany) {
    var companyId = 'company-base-info' + indexCompany
    var addrefId = 'button-add-reference' + indexCompany;
    // show reference 2 form
    $('#' + companyId).find("#reference-information1").show();
    // hide add reference button
    $('#' + companyId).find('#' + addrefId).hide();
}

function removeReference(indexCompany) {
    var companyId = 'company-base-info' + indexCompany
    var addrefId = 'button-add-reference' + indexCompany;
    // show add reference button
    $('#' + companyId).find('#' + addrefId).show();
    // hide reference 2 form
    $('#' + companyId).find("#reference-information1").hide();
}

function addCompany() {
    // get company
    if (countCompany == limitCompany - 1) {
        $("#button-add-company").hide();
    }
    if (countCompany < limitCompany) {
        countCompany++;
        indexCompany++;
        var newFormId = 'company-base-info' + indexCompany;
        // add company form
        $("#company-base-info0").clone().attr('id', newFormId).appendTo("#company-information");
        // show remove button of this form
        $('#' + newFormId).find("#button-remove-company").show();
        $('#' + newFormId).find("#button-remove-company").attr('onclick', 'removeCompany(' + indexCompany + ')');
        // change parameter of button onclick
        $('#' + newFormId).find("#button-remove-reference1").attr('onclick', 'removeReference(' + indexCompany + ')');
        // show add reference button
        $('#' + newFormId).find("#button-add-reference0").attr('onclick', 'addReference(' + indexCompany + ')');
        $('#' + newFormId).find("#button-add-reference0").attr('id', 'button-add-reference' + indexCompany);
        removeReference(indexCompany);
    }
}
function removeCompany(indexCompany) {
    var formId = 'company-base-info' + indexCompany;
    $('#' + formId).remove();
    countCompany--;
    $("#button-add-company").show();
}

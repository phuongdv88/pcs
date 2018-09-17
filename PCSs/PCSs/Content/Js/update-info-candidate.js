$(function () {
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' // optional
    });
});
$(document).ready(function ()
{
    $('select').change(function () {
        /* Act on the event */
        $('select option:selected').each(function () {
            var cmd = $(this).attr('id');

            if (cmd == 'checkpasstportnumber') {
                $('#iddate').hide();
                $('#idsupply').hide();
                $('#idnumber').replaceWith(function () {
                    return '<div id="passportnumber">' +
                    '<div class="form-group col-md-6">' +
                    '<label for="">PassportNumber</label>' +
                    '<input type="text" class="form-control" required="">' +
                    '</div>' +
                    '</div>';
                });
            }
            if (cmd == 'checkidnumber') {
                $('#passportnumber').replaceWith(function () {
                    $('#iddate').show();
                    $('#idsupply').show();
                    return '<div class="form-group col-md-3" id="idnumber">' +
                    '<label for="">IDNumber</label>' +
                    '<input type="text" class="form-control" placeholder="Số CMND" maxlength="13" minlength="9">' +
                    '</div>';
                });
            }
        });
    });
   
});

var limitCompany = 3; // max references
var countCompany = 1; //counter of references
var indexCompany = 0; //counter of references
function addReference(indexCompany) {
    var companyId = 'company-base-info';
    if (indexCompany > 0) {
        companyId += indexCompany;
    }
    // show reference 2 form
    $('#' + companyId).find("#reference-information1").show();
    // hide add reference button
    $('#' + companyId).find("#button-add-reference").hide();
}

function removeReference(indexCompany) {
    var companyId = 'company-base-info'
    if(indexCompany > 0){
        companyId += indexCompany;
    }
    // hide reference 2 form
    $('#' + companyId).find("#reference-information1").hide();
    // show add reference button
    $('#' + companyId).find("#button-add-reference").show();
}

//$("#button-add-company").click(function () {
//    // get company
//    if (count_company == limit_company -1) {
//        $("#button-add-company").hide();
//    }
//    if (count_company < limit_company) {
//        count_company++;
        
//        // add company form
//        $("#company-base-info").clone().attr('id', 'company-base-info' + count_company).appendTo("#company-information");

//    }
//})
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
        $("#company-base-info").clone().attr('id', newFormId).appendTo("#company-information");
        // show remove button of this form
        $('#' + newFormId).find("#button-remove-company").show();
        $('#' + newFormId).find("#button-remove-company").attr('onclick', 'removeCompany(' + indexCompany + ')');
        // change parameter of button onclick
        $('#' + newFormId).find("#button-remove-reference").attr('onclick', 'removeReference(' + indexCompany + ')');
        // show add reference button
        $('#' + newFormId).find("#button-add-reference").attr('onclick', 'addReference(' + indexCompany + ')');
    }
}
function removeCompany(indexCompany) {
    var formId = 'company-base-info' + indexCompany;
    $('#' + formId).remove();
    countCompany--;
    $("#button-add-company").show();
}

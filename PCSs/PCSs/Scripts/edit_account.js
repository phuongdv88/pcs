

function _getAllSpecialist(){
    $('#tableSpecialist').DataTable().clear();
    $('#tableSpecialist').DataTable().destroy();
    $.ajax({
        url: '/Admin/GetAllSpecialist',
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            var html = '';
            var i = 0;
           
            $.each(result, function (key) {
                i++;
               
                html += '<tr>';
                html += '<td>' + i + '</td>';
                html += '<td>' + result[i - 1].spec.FirstName + " " + result[i - 1].spec.MiddleName + " " + result[i - 1].spec.LastName + '</td>';
                html += '<td>' + result[i - 1].spec.Email + '</td>';
                html += '<td>' + result[i - 1].spec.PhoneNumber + '</td>';
                html += '<td>Specialist</td>';
                html += '<td>' + result[i - 1].LockoutEnabled+'</td>';
                html += '<td> <a href="#" title ="Edit" onclick="return _getSpecialistById(' + result[i - 1].spec.SpecialistId + ')"><i class="fa fa-edit"></i></a ><a href="#" title="Delete" onclick="return _deleteSpecialist(' + result[i - 1].spec.SpecialistId + ')"><i class="fa fa-remove"></i></a></td>';
                html += '</tr>';
            });
            $('#tableSpecialist tbody').html(html);
            $('#tableSpecialist').DataTable();
        },
        error: function (errorMessage) {
            //alert(errorMessage.responseText);
        }
    });
    return false;
}
function _addSpecialist() {
    
    var ojb = {

        FirstName: $.trim($('#fristnameSpecialist').val()),
        MiddleName: $.trim($('#middlenameSpecialist').val()),
        LastName: $.trim($('#lastnameSpecialist').val()),
        Email: $.trim($('#emailSpecialist').val()),
        PhoneNumber: $.trim($('#phoneSpecialist').val()),
        UserName: $.trim($('#usernameSpecialist').val()),
        PasswordRaw: $.trim($('#passwordSpecialist').val()),
        LockoutEnabled: $.trim($('#lockoutSpecialist').val())
    }
   
    $.ajax({
        url: '/Admin/CreateSpecialist',
        data: JSON.stringify(ojb),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            alert("them thanh cong");
            $('#newSpecialist').modal('hide');
            $('#btnrefreshSpecialist').click();
        },
        error: function (errorMessage) {
            // alert(errorMessage.responseText);
            alert("them khong thanh cong");
        }
    });
    return false;
}
function _deleteSpecialist(id) {
    alert(id);
    rs = confirm('Are your sure to delete this specialist');
    if (rs) {
        $.ajax({
            url: '/Admin/DeleteSpecialist/' + id,
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            timeout: '5000',
            async: true,
            success: function () {
                alert("xoa thanh cong");
                $('#btnrefreshSpecialist').click();
            },
            error: function (errorMessage) {
                alert(errorMessage.responseText);
            }
        });
    }
    return false;
}
function _getSpecialistById(id) {
    $.ajax({
        url: '/Admin/GetSpecialistById/' + id,
        type: 'GET',
        contentType: 'json',
        timeout: '5000',
        success: function (result) {
           
            var lockout = result[0].userlogin.LockoutEnabled;
          
           
            $('#fristnameSpecialist').val(result[0].spec.FirstName);
            $('#middlenameSpecialist').val(result[0].spec.MiddleName);
            $('#lastnameSpecialist').val(result[0].spec.LastName);
            $('#emailSpecialist').val(result[0].spec.Email);
            $('#phoneSpecialist').val(result[0].spec.PhoneNumber);
            $('#usernameSpecialist').val(result[0].userlogin.UserName);
            $('#passwordSpecialist').val(result[0].userlogin.PasswordRaw);
            if (lockout ==true) {
                $('#lockoutSpecialist').val("true");

            }
            else {
                $('#lockoutSpecialist').val("false");
            }
            //$('#lockoutSpecialist').val(lockout);
            $('#newSpecialist').modal('show');
            $('#addSpecialist').val("Update");
            $('#formSpecialist').attr("onsubmit", "_updateSpecialist(" + id + ")");
            $('#nameModal').text("Update Information Specialist");
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }

    });
    return false;

}
function _updateSpecialist(id) {
    var ojb = {
        SpecialistId: id,
        FirstName: $.trim($('#fristnameSpecialist').val()),
        MiddleName: $.trim($('#middlenameSpecialist').val()),
        LastName: $.trim($('#lastnameSpecialist').val()),
        Email: $.trim($('#emailSpecialist').val()),
        PhoneNumber: $.trim($('#phoneSpecialist').val()),  
          UserName: $.trim($('#usernameSpecialist').val()),
        PasswordRaw: $.trim($('#passwordSpecialist').val()),
        LockoutEnabled: $.trim($('#lockoutSpecialist').val())
       
    };
    
    $.ajax({
        url: '/Admin/UpdateSpecialist',
        data: JSON.stringify(ojb),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        timeout: '5000',
        success: function () {
            alert("update thanh cong");
            $('#newSpecialist').modal('hide');
            $('#btnrefreshSpecialist').click();
        },
        error: function (errorMessage) {
            alert("loi ");
            //alert(errorMessage.responseText);
        }
    });
    return false;
}
$('#showModalNewSpecialist').click(function () {
    $('#nameModal').text("New Specialist");
    $('#newSpecialist').modal('show');
    $('#formSpecialist').attr("onsubmit", "_addSpecialist()");
    $('#addSpecialist').val("Add");
    $('input[type=text],[type=email]').val("");
});
$("#formSpecialist").submit(function (e) {
    e.preventDefault();
});
function _checkNullUserName() {

    var id = $('#usernameSpecialist').val();
    
  
    $.ajax({
        url: '/Admin/GetAllUserLoginByUserName/' + id,
       
        type: 'GET',
        contentType: 'json',
        timeout: '5000',
        success: function (result) {
            if (result == "") {
                $('#addSpecialist').prop('disabled', false);
                $('#errorUserName').css("display", "none");
               
                //alert("disabled false");
            }
            else {
                $('#addSpecialist').prop("disabled", true);
                $('#errorUserName').css("display", "block");
              
                //alert("disabled true");
            }
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}
// get all recruiter
//function _getAllRecruiter() {
//    $.ajax({
//        url: '/Admin/GetAllRecruiter',
//        type: "GET",
//        contentType: "application/json;charset=utf-8",
//        dataType: "json",
//        timeout: '5000',
//        success: function (data) {
//            var html = '';
//            var i = 0;
//            $.each(data, function (key, item) {
//                i++;
//                html += '<tr>';
//                html += '<td>' + i + '</td>';
//                html += '<td>' + item.FirstName + " " + item.MiddleName + " " + item.LastName + '</td>';
//                html += '<td>' + item.ClientId + '</td>';
//                html += '<td>' + item.Email + '</td>';
//                html += '<td>' + PhoneNumber + '</td>';
//                html += '<td> <a href="#" title="Edit">< i class="fa fa-edit" ></i ></a ><a href="#" title="Delete"><i class="	fa fa-remove"></i></a></td>';
//                html += '</tr>';
//            });
//            $('#tableRecuiter tbody').html(html);
//            $('#tableRecuiter').DataTable();
//        },
//        error: function (errorMessage) {

//        }
//    });
//    return false;
//}
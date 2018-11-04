changePasswordModalHtml = $("#changePassModal").html();

$(document).ready(function () {
    $("#changePassModal").on('hidden.bs.modal', function () {
        $("#changePassModal").html(changePasswordModalHtml);
    })

    Number.prototype.padLeft = function (base, chr) {
        var len = (String(base || 10).length - String(this).length) + 1;
        return len > 0 ? new Array(len).join(chr || '0') + this : this;
    }
});

function formatDate(inputStr) {
    var d = new Date(parseInt(inputStr));
    dformat = [d.getFullYear().padLeft(),
              (d.getMonth() + 1).padLeft(),
              d.getDate().padLeft()].join('/') + ' ' +
              [d.getHours().padLeft(),
              d.getMinutes().padLeft(),
              d.getSeconds().padLeft()].join(':');
    return dformat;
}
function setUserLoginName(userName) {
    $("#UserName").val(userName);
}
function getProfile() {
    $.ajax({
        url: '/Specialist/GetSpecialistProfile',
        type: 'Get',
        contentType: "json",
        timeout: '5000',
        success: function (result) {
            $('#specialistFirstName').val(result.FirstName);
            $('#specialistMiddleName').val(result.MiddleName);
            $('#specialistLastName').val(result.LastName);
            $('#specialistEmail').val(result.Email);
            $('#specialistPhoneNumber').val(result.PhoneNumber);
            $('#changeProfileModal').modal('show');
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
}

function editProfile() {
    var obj = {
        FirstName: $('#specialistFirstName').val(),
        MiddleName: $('#specialistMiddleName').val(),
        LastName: $('#specialistLastName').val(),
        Email: $('#specialistEmail').val(),
        PhoneNumber: $('#specialistPhoneNumber').val(),
    }

    $.ajax({
        url: '/Specialist/UpdateSpecialistProfile',
        data: JSON.stringify(obj),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (result) {
            $("#changeProfileModal").modal('hide');
            // update profile and title
            $("#welcomeUser").text("Welcome " + result.msg);
            $("#title").text(result.msg);
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function updatePassword() {
    var obj = {
        OldPassword: $('#oldPassword').val(),
        NewPassword: $('#newPassword').val(),
    }

    $.ajax({
        url: '/Specialist/UpdatePassword',
        data: JSON.stringify(obj),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '5000',
        success: function (rs) {
            if (rs.result == -1) {
                // show error
                $("#changePasswordMessage").text(rs.msg);
            } else {
                $("#changePassModal").modal('hide');
            }
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

var password = document.getElementById("newPassword")
  , confirm_password = document.getElementById("confirmPassword");


function validateConfirmPassword() {

    if (password.value != confirm_password.value) {
        confirm_password.setCustomValidity("Passwords Don't Match");
    } else {
        confirm_password.setCustomValidity('');
    }
}

password.onchange = validateConfirmPassword;
confirm_password.onkeyup = validateConfirmPassword;


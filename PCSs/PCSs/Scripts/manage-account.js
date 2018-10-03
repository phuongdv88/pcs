$(document).ready(function () {
    //_getAllCandidate();
});
var currentRecruiterId = -1;

Number.prototype.padLeft = function (base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
}


function formatDate(inputStr) {
    var d = new Date(parseInt(inputStr));
    dformat = [d.getHours().padLeft(),
                   d.getMinutes().padLeft(),
                   d.getSeconds().padLeft()].join(':') + ' ' +
                   [d.getDate().padLeft(),
                   (d.getMonth() + 1).padLeft(),
                   d.getFullYear().padLeft()].join('/');
    return dformat;
}
function _setCurrentRecruitId(id) {
    currentRecruiterId = id;
}
function _getAllCandidate(id) {
    $.ajax({
        url: '/Client/GetAllCandidate/' + id,
        //data: '{id: ' + id + ' }',
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '3000',
        success: function (result) {
            var html = '';
            var i = 0;
            $.each(result, function (key, item) {
                i++;
                html += '<tr>';
                html += '<td>' + i + '</td>';
                html += '<td>' + item.FirstName + " " + item.MiddleName + " " + item.LastName + '</td>';
                html += '<td>' + item.Email + '</td>';
                html += '<td>' + item.PhoneNumber + '</td>';
                html += '<td>' + item.Status + '</td>';
                html += '<td>' + formatDate(item.CreatedTime.substr(6)) + '</td>';
                if (item.CompleteTime == undefined) {
                    html += '<td>N/A</td>';
                }
                else {
                    html += '<td>' + formatDate(item.CompleteTime.substr(6)) + '</td>';
                }
                html += '<td><a href="#" onClick="return _getCandidateById(' + item.CandidateId + ')" class="fas fa-pencil-alt"></a></td>';
                html += '<td><a href="#" onClick="return _getCandidateInfoById(' + item.UserLoginId + ')" class="far fa-calendar-alt"></a></td>';
                html += '</tr>';
            });
            $('#candidates tbody').html(html);
            $('#candidates').DataTable()

        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function _getAllCandidateReport(id) {
    $.ajax({
        url: '/Client/GetAllCandidateCompleted/' + id,
        //data: '{id: ' + id + ' }',
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: '3000',
        success: function (result) {
            var html = '';
            var i = 0;
            $.each(result, function (key, item) {
                i++;
                html += '<tr>';
                html += '<td>' + i + '</td>';
                html += '<td>' + item.FirstName + " " + item.MiddleName + " " + item.LastName + '</td>';
                html += '<td>' + item.Email + '</td>';
                html += '<td>' + item.PhoneNumber + '</td>';
                if (item.CompleteTime == undefined) {
                    html += '<td>N/A</td>';
                }
                else {
                    html += '<td>' + formatDate(item.CompleteTime.substr(6)) + '</td>';
                }
                html += '<td><a href="#" onClick="return _getCandidateReportById(' + item.UserLoginId + ')" class="far fa-calendar-alt"></a></td>';
                html += '</tr>';
            });
            $('#report tbody').html(html);
            $('#report').DataTable()

        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function _getCandidateReportById(id) {
    $.ajax({
        url: '/Client/GetCandidateReport/' + id,
        type: 'Get',
        contentType: "json",
        success: function (result) {
            //$('#candiateInfoModal').modal('show');
            alert('Show info or view pdf file from' + result.link);
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
    return false;
}

function _getCandidateById(id) {
    $.ajax({
        url: '/Client/GetCandidate/' + id,
        type: 'Get',
        contentType: "json",
        success: function (result) {
            $('#candidateId').val(result.CandidateId);
            $('#firstName').val(result.FirstName);
            $('#middleName').val(result.MiddleName);
            $('#lastName').val(result.LastName);
            $('#email').val(result.Email);
            $('#phoneNumber').val(result.PhoneNumber);
            $('#jobTitle').val(result.JobTitle);
            $('#jobLevel').val(result.JobLevel);
            $('#newCandidateModal').modal('show');
            $('#btnUpdate').show();
            $('#btnAdd').hide();
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}
/// generate information that is including user name and password of candidate
function _getCandidateInfoById(id) {
    $.ajax({
        url: '/Client/GetCandidateInfo/' + id,
        type: 'Get',
        contentType: "json",
        success: function (result) {
            //$('#userNameInfo').append(result.UserName); // need to update to db the field userName, password of candiate table
            //$('#passwordRaw').append(result.PasswordRaw);
            //if (result.LockoutDateUtc == undefined) {
            //    $('#lockoutDateUtc').append('N/A'); // 5day from created date
            //} else {
            //    $('#lockoutDateUtc').append(formatDate(result.LockoutDateUtc.substr(6))); // 5day from created date
            //}
            $('#userNameInfo').text(result.UserName); // need to update to db the field userName, password of candiate table
            $('#passwordRaw').text(result.PasswordRaw);
            if (result.LockoutDateUtc == undefined) {
                $('#lockoutDateUtc').text('N/A'); // 5day from created date
            } else {
                $('#lockoutDateUtc').text(formatDate(result.LockoutDateUtc.substr(6))); // 5day from created date
            }
            
            $('#candiateInfoModal').modal('show');
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function _add() {
    var obj = {
        CandidateId:'0',
        FirstName: $('#firstName').val(),
        MiddleName: $('#middleName').val(),
        LastName: $('#lastName').val(),
        Email: $('#email').val(),
        PhoneNumber: $('#phoneNumber').val(),
        JobTitle: $('#jobTitle').val(),
        JobLevel: $('#jobLevel').val(),
        CurrentRecruiterId: currentRecruiterId
    }

    $.ajax({
        url: '/Client/CreateCandidate',
        data: JSON.stringify(obj),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            $('#btnRefresh').click();
            $("#newCandidateModal").modal('hide');
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
}

function _edit() {
    var obj = {
        CandidateId: $('#candidateId').val(),
        FirstName: $('#firstName').val(),
        MiddleName: $('#middleName').val(),
        LastName: $('#lastName').val(),
        Email: $('#email').val(),
        PhoneNumber: $('#phoneNumber').val(),
        JobTitle: $('#jobTitle').val(),
        JobLevel: $('#jobLevel').val(),
        CurrentRecruiterId: currentRecruiterId
    }

    $.ajax({
        url: '/Client/UpdateCandidate',
        data: JSON.stringify(obj),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            $('#btnRefresh').click();
            $("#newCandidateModal").modal('hide');
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
}
$(document).ready(function () {
    //_getAllCandidate();
});

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
            $.each(result, function (key, item) {
                html += '<tr>';
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
                html += '<td><a href="#" onClick="return _getCandidateInfoById(' + item.CandidateId + ')" class="far fa-calendar-alt"></a></td>';
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

function _getCandidateById(id) {
    $.ajax({
        url: '/Client/GetCandidate/' + id,
        type: 'Get',
        contentType: "json",
        success: function (result) {
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
function _getCandidateInfoById(id){
    $.ajax({
        url: '/Client/GetCandidate/' + id,
        type: 'Get',
        contentType: "json",
        success: function (result) {
            $('#userName').val(result.UserName); // need to update to db the field userName, password of candiate table
            $('#password').val(result.Password);
            $('#lastTimeToUpdate').val(Date.now); // 5day from created date
            $('#CandiateInfoModal').modal('show');
        },
        error: function (errorMessage) {
            alert(errorMessage.responseText);
        }
    });
    return false;
}

function _add() {

}

function _edit() {

}
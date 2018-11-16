

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
            $.each(result, function (key, item) {
                i++;
                html += '<tr>';
                html += '<td>' + i + '</td>';
                html += '<td>' + item.FirstName + " " + item.MiddleName + " " + item.LastName+ '</td>';
                html += '<td>' + item.Email + '</td>';
                html += '<td>' + item.PhoneNumber + '</td>';
                html += '<td>Specialist</td>';
                html += '<td> <a href="#" title ="Edit" onclick="return _getSpecialistById(' + item.SpecialistId + ')"><i class="fa fa-edit"></i></a ><a href="#" title="Delete" onclick="return _deleteSpecialist(' + item.SpecialistId + ')"><i class="fa fa-remove"></i></a></td>';
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
        PhoneNumber: $.trim($('#phoneSpecialist').val())
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

            $('#fristnameSpecialist').val(result.FirstName);
            $('#middlenameSpecialist').val(result.MiddleName);
            $('#lastnameSpecialist').val(result.LastName);
            $('#emailSpecialist').val(result.Email);
            $('#phoneSpecialist').val(result.PhoneNumber);
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
        PhoneNumber: $.trim($('#phoneSpecialist').val())
    }
    $.ajax({
        url: '/Admin/UpdateSpecialist',
        data: JSON.stringify(ojb),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        timeout: '5000',
        success: function () {
            alert("update thanh cong");
            //$('#newSpecialist').modal('hide');
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
})
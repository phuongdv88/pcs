Number.prototype.padLeft = function (base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
}

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
function formatMonthOnly(inputStr) {
    var d = new Date(parseInt(inputStr));
    dformat = [(d.getMonth() + 1).padLeft(), d.getFullYear().padLeft()].join('/');
    return dformat;
}
// kiểm tra rỗng của dữ liệu
var isNull = function (value) {
    if (isTypeOfString(value)) {
        if (value === '' || value === "" || value === null || value === undefined) {
            return true;
        }
    } else if (isTypeOfObject(value)) {
        if (value === '' || value === "" || value === null || value === undefined) {
            return true;
        }
    }
    else if (isTypeOfArray(value)) {
        if (value.length === 0) {
            return true;
        }
    } else if (isTypeOfUndefined(value)) {
        return true;
    }
    return false;
}
// kiểm tra không rỗng của dữ liệu
var isNotNull = function (value) {
    if (isTypeOfString(value)) {
        if (value !== '' && value !== "" && value !== null && value !== undefined) {
            return true;
        }
    } else if (isTypeOfObject(value)) {
        if (value !== '' && value !== "" && value !== null && value !== undefined) {
            return true;
        }
    }
    else if (isTypeOfArray(value)) {
        if (value.length > 0) {
            return true;
        }
    }
    return false;
}
var isTypeOfString = function (value) {
    if (typeof (value) === 'string') {
        return true;
    }
    return false;
}
var isNotTypeOfString = function (value) {
    if (typeof (value) !== 'string') {
        return true;
    }
    return false;
}
var isTypeOfObject = function (value) {
    if (typeof (value) === 'object') {
        return true;
    }
    return false;
}
var isNotTypeOfObject = function (value) {
    if (typeof (value) !== 'object') {
        return true;
    }
    return false;
}
var isTypeOfUndefined = function (value) {
    if (typeof (value) === 'undefined') {
        return true;
    }
    return false;
}
var isNotTypeOfUndefined = function (value) {
    if (typeof (value) !== 'undefined') {
        return true;
    }
    return false;
}
var isTypeOfArray = function (value) {
    if (typeof (value) === 'object') {
        try {
            var checkArray = value.length;
            return true;
        } catch (ex) {
        }
    }
    return false;
}
var isNotTypeOfArray = function (value) {
    if (typeof (value) === 'object') {
        try {
            var checkArray = value.length;
            return false;
        } catch (ex) {
            return true;
        }
    }
    return false;
}
var isTypeOfNummeric = function (value) {
    var regex = new RegExp('^[0-9]+$');
    return regex.test(value);
}
var isNotTypeOfNummeric = function (value) {
    var regex = new RegExp('^[0-9]+$');
    return regex.test(value);
}
var isTypeOfNumberFloat = function (value) {
    var regex = /^-?\d*\.?\d*$/
    return regex.test(value);
}
var isNotTypeOfNumberFloat = function (value) {
    var regex = /^-?\d*\.?\d*$/
    return !regex.test(value);
}
var getB64Str = function (buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
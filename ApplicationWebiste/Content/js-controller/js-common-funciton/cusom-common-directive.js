var convertDateFull = function (value) {
    return (new Date(value).getDate() < 10 ? '0' : '') + '' + new Date(value).getDate() + '/' + ((new Date(value).getMonth() + 1) < 10 ? '0' : '') + '' + (new Date(value).getMonth() + 1) + '/' + new Date(value).getFullYear() + ' ' + (new Date(value).getHours() < 10 ? '0' : '') + '' + new Date(value).getHours() + ':' + (new Date(value).getMinutes() < 10 ? '0' : '') + '' + new Date(value).getMinutes();
}
var convertOnlyDate = function (value) {
    return (new Date(value).getDate() < 10 ? '0' : '') + '' + new Date(value).getDate() + '/' + ((new Date(value).getMonth() + 1) < 10 ? '0' : '') + '' + (new Date(value).getMonth() + 1) + '/' + new Date(value).getFullYear();
}
app.directive('datetimePickerFull', ['$filter', function () {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            $(elem).datetimepicker({
                timepicker: true,
                step: 5,
                format: 'd/m/Y H:i'
            });
            ctrl.$formatters.unshift(function (viewValue) {
                if (viewValue != undefined) {
                    if (viewValue.indexOf('/Date') != -1) {
                        viewValue = parseFloat(viewValue.substr(6, 13));
                    }
                    return convertDateFull(viewValue);
                }
            });
            ctrl.$parsers.unshift(function (viewValue) {
                if (viewValue != undefined && viewValue != '') {
                    try {
                        var hours = viewValue.split(' ');
                        var split = hours[0].split('/');
                        var result = '/Date(' + (new Date(split[2] + '-' + split[1] + '-' + split[0] + ' ' + hours[1]).getTime()) + ')/';
                        return result;
                    } catch (ex) {
                        return '';
                    }
                }
            });
        }
    };
}]);
app.directive('datetimePickerOnlyDate', ['$filter', function () {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            $(elem).datetimepicker({
                timepicker: false,
                step: 5,
                format: 'd/m/Y'
            });
            ctrl.$formatters.unshift(function (viewValue) {
                if (viewValue != undefined) {
                    if (viewValue.indexOf('/Date') != -1) {
                        viewValue = parseFloat(viewValue.substr(6, 13));
                    }
                    return convertOnlyDate(viewValue);
                }
            });
            ctrl.$parsers.unshift(function (viewValue) {
                if (viewValue != undefined && viewValue != '') {
                    try {
                        var split = viewValue.split('/');
                        var result = '/Date(' + (new Date(split[2] + '-' + split[1] + '-' + split[0]).getTime()) + ')/';
                        return result;
                    } catch (ex) {
                        return '';
                    }
                }
            });
        }
    };
}]);
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
app.directive("filereadsinger", [function () {
    return {
        scope: {
            filereadsinger: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                var fileName = changeEvent.target.files[0].name;
                var filetype = changeEvent.target.files[0].type;

                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        var cont = loadEvent.target.result
                        var base64String = getB64Str(cont);
                        scope.$parent.model.FileName = undefined;
                        scope.filereadsinger = [];
                        scope.filereadsinger.push({
                            contentType: filetype,
                            contentAsBase64String: base64String,
                            fileName: fileName
                        })
                    });
                }
                reader.readAsArrayBuffer(changeEvent.target.files[0]);
            });
        }
    }
}]);
app.directive("filereadmulti", [function () {
    return {
        scope: {
            filereadmulti: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                var fileName = changeEvent.target.files[0].name;
                var filetype = changeEvent.target.files[0].type;

                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        var cont = loadEvent.target.result
                        var base64String = getB64Str(cont);
                        if (isNull(scope.fileread)) {
                            scope.filereadmulti = [];
                        }
                        scope.$parent.model.FileName = undefined;
                        scope.filereadmulti.push({
                            contentType: filetype,
                            contentAsBase64String: base64String,
                            fileName: fileName
                        })
                    });
                }
                reader.readAsArrayBuffer(changeEvent.target.files[0]);
            });
        }
    }
}]);
// đọc file thực hiện import
app.directive("filereadqueryimport", [function () {
    return {
        scope: {
            filereadqueryimport: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                var fileName = changeEvent.target.files[0].name;
                var filetype = changeEvent.target.files[0].type;
                var input = changeEvent.target;
                var reader = new FileReader();
                reader.onload = function () {
                    var fileData = reader.result;
                    var wb = XLSX.read(fileData, { type: 'binary' });

                    wb.SheetNames.forEach(function (sheetName) {
                        var rowObj = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
                        scope.$apply(function () {
                            scope.filereadqueryimport = rowObj;
                        });
                        var jsonObj = JSON.stringify(rowObj);
                        console.log(jsonObj);
                    })
                };
                reader.readAsBinaryString(input.files[0]);
            });
        }
    }
}]);
app.directive('displayHistory', function () {
    return {
        restrict: 'A',
        template:
            '<ul class="list-inline pull-left">' +
            ' <li title="Người tạo" class="fontsmall ng-binding"  style="font-size :10px !important;">' +
            ' <i class="fa fa-user"></i>Người tạo: {{H_createdBy}}' +
            '  </li>' +
            '<li title="Ngày tạo" class="fontsmall ng-binding"  style="font-size :10px !important;">' +
            '<i class="fa fa-calendar"></i>Ngày tạo: {{H_createdDate}}' +
            '   </li>' +
            ' <li title="Người sửa" class="fontsmall ng-binding"  style="font-size :10px !important;">' +
            ' <i class="fa fa-user"></i>Người sửa: {{H_modifiedBy}}' +
            '  </li>' +
            '  <li title="Ngày sửa" class="fontsmall ng-binding"  style="font-size :10px !important;">' +
            '<i class="fa fa-calendar"></i>Ngày sửa: {{H_modifiedDate}}' +
            '</li>' +
            '</ul>',
        link: function (scope, elem, attrs) {
            scope.$watch(attrs.displayHistory, function (newvalue, oldvalue) {
                if (newvalue != undefined) {
                    scope.H_createdBy = newvalue.CreatedBy;
                    scope.H_createdDate = newvalue.CreatedDateOfString;
                    scope.H_modifiedDate = newvalue.ModifiedDateOfString;
                    scope.H_modifiedBy = newvalue.ModifiedBy;
                }
            }, true);
        }
    }
}
)
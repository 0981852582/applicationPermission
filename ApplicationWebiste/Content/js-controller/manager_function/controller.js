var controller = "ManagerFunction";
var folderJs = "/Content/js-controller/manager_function/";
app.directive('ngTable', function ($filter, $timeout) {
    return {
        require: 'ngModel',
        link: function ($scope, $element, $attrs, ngModel) {
            $scope.$watch($attrs['ngModel'], function (newvalue, oldvalue) {
                if (newvalue != undefined) {
                    if (isTypeOfArray(newvalue)) {
                        var string = '<table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer" id="sample_1" role="grid" aria-describedby="sample_1_info">';
                        // get header
                        string += '<thead><tr>';
                        for (var j = 0; j < newvalue.length; j++) {
                            var styleClass = '';
                            var hiden = false;
                            var orderBy = false;
                            var style = '';
                            var id = '';
                            if (newvalue[j]['hiden']) {
                                hiden = true;
                            }
                            if (newvalue[j]['orderBy']) {
                                orderBy = true;
                            }
                            if (isTypeOfArray(newvalue[j]['hiden'])) {
                                hiden = true;
                            }
                            if (isTypeOfArray(newvalue[j]['class'])) {
                                for (var iClass = 0; iClass < newvalue[j]['class'].length; iClass++) {
                                    styleClass += newvalue[j]['class'][iClass] + ' ';
                                }
                            }
                            if (isTypeOfArray(newvalue[j]['style'])) {
                                for (var iStyle = 0; iStyle < newvalue[j]['style'].length; iStyle++) {
                                    if (isTypeOfArray(newvalue[j]['style'][iStyle])) {
                                        style += newvalue[j]['style'][iStyle][0] + ':' + newvalue[j]['style'][iStyle][1] + ';';
                                    }
                                }
                            }
                            if (isNotNull(newvalue[j]['id'])) {
                                id = newvalue[j]['id'];
                            }
                            if (isNotNull(newvalue[j]['header']) && !newvalue[j]['hiden']) {
                                string += '<td tabindex="0" id="' + id + '" class="' + styleClass + ' ' + (orderBy ? 'sorting' : '') + '" style="' + style + '">' + newvalue[j]['header'] + '</td>';
                            }
                        }
                        string += '</tr></thead>';
                        // get content
                        var dataContent = [];
                        var getSource = newvalue.filter(function (x) { return x.source != undefined });
                        if (getSource.length > 0) {
                            dataContent = getSource[0].source;
                        }
                        for (var i = 0; i < dataContent.length; i++) {
                            string += '<tr>';
                            for (var j = 0; j < newvalue.length; j++) {
                                if (dataContent[i][newvalue[j]['column']] != undefined && !newvalue[j]['hiden']) {
                                    string += '<td>' + dataContent[i][newvalue[j]['column']] + '</td>';
                                }
                            }
                            string += '</tr>';
                        }

                        string += '</table>';
                        $element.append(string);
                        TableDatatablesManaged.init();
                    }
                }
            }, true);
            $('#example').DataTable();
            $('#example').DataTable();
        }

    }
});
app.controller('managerFunction', function ($scope, $rootScope, $http, $timeout, $interval, $uibModal) {
    //
    var trong = $scope;
    var timeout = $timeout;
    var interval = $interval;
    var http = $http;
    var data = [];
    trong.dataTable = {
        currentPage: trong.settingOfPadding.currentPage,
        maxSize: trong.settingOfPadding.maxSize,
        totalItem: 0,
        numberPage: trong.settingOfPadding.numberPage,
        values: [],
        valueSearch: '',
        orderBy: trong.settingOfPadding.orderBy,
        orderType: trong.settingOfPadding.orderType,
        eventOrderBy: function (fieldOrder) {
            if (fieldOrder != undefined) {
                if (fieldOrder == this.orderBy) {
                    this.orderType = !this.orderType
                } else {
                    this.orderBy = fieldOrder;
                    this.orderType = true;
                }
                this.query();
            }
        },
        query: function (isChangeCondition) {
            if (isChangeCondition) {
                this.currentPage = 1;
                trong.isCheckAll = false;
            }
            
            var parameter = {
                skip: (this.currentPage - 1) * this.numberPage,
                top: this.numberPage,
                orderBy: this.orderBy,
                orderType: this.orderType,
                search: this.valueSearch
            };
            var $this = this;
            trong.onBlockUI('#dataTable', trong.variableMessageBlockUI);
            http.post("/" + controller + "/DataTable/", parameter).then(function (rs) {
                if (isNull(rs.data)) {
                    trong.showMessageError('Tài khoản không có quyền thực hiện chức năng này');
                } else {
                    $timeout(function () {
                        this.values = [];
                        $this.values = rs.data.data;
                        $this.totalItem = rs.data.totalItem;     
                        trong.offBlockUI('#dataTable');
                    }, 500);
                    
                }
            });
        }
    };
    trong.$watch('dataTable', function (newvalue, oldvalue) {
        var m = newvalue;
    }, true);
    trong.dataTable.query();

    console.log($scope.global_permission);
    trong.checkAll = function () {
        for (var i = 0; i < trong.dataTable.values.length; i++) {
            var item = trong.dataTable.values[i];
            item.isChecked = trong.isCheckAll;
        }
    }
    http.post("/" + controller + "/DataTable/").then(function (rs) {
        if (isNull(rs.data)) {
            trong.showMessageError('Tài khoản không có quyền thực hiện chức năng này');
        } else {
            trong.dataTable.values = rs.data;
        }
    });
    // submit
    trong.submit = function () {
        if (isNull(trong.Tree_listTreeSelected)) {
            trong.Tree_listTreeSelected = [];
        }
        if (trong.Tree_listTreeSelected.length == 0) {
            trong.Tree_listTreeSelected.push({
                Group: trong.Tree_groupValue
            });
        }
        http.post("/" + controller + "/updatePermisstion/", trong.Tree_listTreeSelected).then(function (rs) {
            if (isNull(rs.data)) {
                trong.showMessageError('Tài khoản không có quyền thực hiện chức năng này');
            } else {
                trong.showMessageSuccess('Cập nhật chức năng thành công');

            }
            // refresh tree function of group
            trong.F_getFunctionToGroup(trong.Tree_groupValue, function () {
                // $(trong.Tree_idTreeViewOfGroup).jstree('open_all');
            });
        });
    }
});
var controller = "ManagerFunction";
var folderJs = "/Content/js-controller/manager_function/";
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
        location: trong.settingOfPadding.location,
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
                        $this.location = rs.data.location;
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

    $scope.menuOptions = [
        //api : html
        //api : text
        // NEW OBJECT BASED IMPLEMENTATION:
        {
            text: function ($itemScope) {
                return '<i class="fa fa-eye"></i> Xem thông tin'
            },
            click: function ($itemScope) {
                trong.dialogView($itemScope.item.Id);
            },
            displayed: function ($itemScope) {
                return true;
            },
            enabled: function ($itemScope) {
                return true;
            },
        },
        {
            text: '<i class="fa fa-edit"></i> Cập nhật thông tin',
            click: function ($itemScope) {
                trong.dialogEdit($itemScope.item.Id);
            },
            displayed: function ($itemScope) {
                return true;
            },
            enabled: function ($itemScope) {
                return true;
            },
        },
        {
            text: '<i class="fa fa-trash-o"></i> Xóa thông tin',
            click: function ($itemScope) {

            },
            displayed: function ($itemScope) {
                return true;
            },
            enabled: function ($itemScope) {
                return true;
            },
        }
    ];
    // phần này để đổi sang các controller khác
        // gọi controller view
    trong.dialogView = function (id) {
        /*begin modal*/
        var modalInstance = $uibModal.open({
            templateUrl: folderJs + 'view.html',
            controller: 'view',
            backdrop: 'static',
            size: '60',
            resolve: {
                parameter: function () {
                    return id;
                }
            }
        });
    };
    trong.dialogEdit = function (id) {
        /*begin modal*/
        var modalInstance = $uibModal.open({
            templateUrl: folderJs + 'edit.html',
            controller: 'edit',
            backdrop: 'static',
            size: '60',
            resolve: {
                parameter: function () {
                    return id;
                }
            }
        });
    };
});

// đây là controller view
app.controller('view', function ($scope, $http, $uibModalInstance, $rootScope, parameter, toaster) {
    $scope.title = "Xem thông tin chức năng.";
    // function close dialog
    $scope.ok = function () {
        $uibModalInstance.close();
    };
    // function close dialog
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
app.controller('edit', function ($scope, $http, $uibModalInstance, $rootScope, parameter, toaster) {
    $scope.title = "Cập nhật thông tin chức năng.";
    // function close dialog
    $scope.ok = function () {
        $uibModalInstance.close();
    };
    // function close dialog
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
// biến controller này là trên controller call server lấy data
var controller = "City";
var folderJs = "/Content/js-controller/directory-city/";
app.controller('directoryCity', function ($scope, $rootScope, $http, $timeout, $interval, $uibModal) {
    //init form vaidate 
    initValidateForm($rootScope);
    var trong = $scope;
    var timeout = $timeout;
    var interval = $interval;
    var http = $http;
    var data = [];
    $rootScope.reload = function () {
        $rootScope.dataTable.query();
    }
    $rootScope.dataTable = {
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
            }
            var parameter = {
                skip: (this.currentPage - 1) * this.numberPage,
                top: this.numberPage,
                orderBy: this.orderBy,
                orderType: this.orderType,
                search: this.valueSearch
            };
            var $this = this;
            trong.onBlockUI(idOfDataTable, trong.variableMessageBlockUI);
            http.post("/" + controller + "/DataTable/", parameter).then(function (rs) {
                if (isNull(rs.data)) {
                    trong.showMessageError('Tài khoản không có quyền thực hiện chức năng này');
                } else {
                    $timeout(function () {
                        this.values = [];
                        $this.values = rs.data.data;
                        $this.totalItem = rs.data.totalItem;
                        $this.location = rs.data.location;
                        trong.isCheckAll = false;
                        trong.offBlockUI(idOfDataTable);
                    }, 500);

                }
            });
        }
    };
    $rootScope.dataTable.query();
    trong.download = function (id) {
        trong.onBlockUI(idOfDataTable, trong.variableMessageBlockUI);
        http({
            method: "GET",
            url: "/" + controller + "/Download/" + id,
        }).then(function (rs) {
            if (isNotNull(rs.data)) {
                window.location.href = "/City/Download/" + id;
            } else {
                trong.showMessageError("file không tồn tại");
            }
            trong.offBlockUI(idOfDataTable);
        });
    }
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
                return trong.global_permission.view;
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
                return trong.global_permission.edit;
            },
            enabled: function ($itemScope) {
                return true;
            },
        },
        {
            text: '<i class="fa fa-trash-o"></i> Xóa thông tin',
            click: function ($itemScope) {
                trong.delete($itemScope.item.Id);
            },
            displayed: function ($itemScope) {
                return trong.global_permission.delete;
            },
            enabled: function ($itemScope) {
                return true;
            },
        }
    ];
    // phần này để đổi sang các controller khác
    // gọi controller add
    trong.dialogAdd = function () {
        /*begin modal*/
        var modalInstance = $uibModal.open({
            templateUrl: folderJs + 'add.html',
            controller: 'add',
            backdrop: 'static',
            size: '60',
            resolve: {
                //parameter: function () {
                //    return id;
                //}
            }
        });
    };
    // gọi controller add
    trong.dialogAddByImport = function () {
        /*begin modal*/
        var modalInstance = $uibModal.open({
            templateUrl: folderJs + 'addImport.html',
            controller: 'addImport',
            backdrop: 'static',
            size: '60',
            resolve: {
                //parameter: function () {
                //    return id;
                //}
            }
        });
    };
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
    trong.delete = function (id) {
        trong.onBlockUI(idOfDataTable, trong.variableMessageBlockUI);
        http({
            method: "POST",
            url: "/" + controller + "/Delete/",
            dataType: 'json',
            data: {
                id: id,
            },
            headers: { "Content-Type": "application/json" }
        }).then(function (rs) {
            var result = rs.data;
            if (isNull(result)) {
                trong.showMessageError("Không có quyền thực hiện chức năng");
            } else if (result.Error) {
                trong.showMessageError(result.Title);
            } else {
                trong.showMessageSuccess(result.Title);
            }
            $rootScope.reload();
        });
    }
    trong.deleteArray = function () {
        var message
        if (isNotTypeOfArray(trong.dataTable.values)) {
            trong.showMessageError('Không có bản ghi nào được chọn');
            return;
        }
        var deleteArray = trong.dataTable.values.filter(function (value) { return value.isChecked == true });
        if (deleteArray.length == 0) {
            trong.showMessageError('Không có bản ghi nào được chọn');
            return;
        }
        var idArray = [];
        for (var i = 0; i < deleteArray.length; i++) {
            idArray.push(deleteArray[i].Id);
        }
        trong.onBlockUI(idOfDataTable, trong.variableMessageBlockUI);
        http({
            method: "POST",
            url: "/" + controller + "/DeleteArray/",
            dataType: 'json',
            data: {
                idArray: idArray,
            },
            headers: { "Content-Type": "application/json" }
        }).then(function (rs) {
            var result = rs.data;
            if (isNull(result)) {
                trong.showMessageError("Không có quyền thực hiện chức năng");
            } else if (result.Error) {
                trong.showMessageError(result.Title);
            } else {
                trong.showMessageSuccess(result.Title);
            }
            $rootScope.reload();
        });
    }
});

// đây là controller view
app.controller('view', function ($scope, $http, $uibModalInstance, $rootScope, parameter, toaster, $interval, $timeout) {
    var trong = $scope;
    var timeout = $timeout;
    var interval = $interval;
    var http = $http;
    trong.title = "Xem thông tin (Tỉnh / Thành phố).";
    // function close dialog
    trong.ok = function () {
        $uibModalInstance.close();
    };
    trong.init = function () {
        trong.onBlockUI(idOfDialog, trong.variableMessageBlockUI);
        http({
            method: "POST",
            url: "/" + controller + "/GetItem/",
            dataType: 'json',
            data: {
                id: parameter,
            },
            headers: { "Content-Type": "application/json" }
        }).then(function (rs) {
            trong.model = rs.data;
            trong.offBlockUI(idOfDialog);
        });
    }
    trong.init();
    // function close dialog
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
// đây là controller add
app.controller('add', function ($scope, $http, $uibModalInstance, $rootScope, $timeout, $interval, toaster) {
    //
    var trong = $scope;
    var timeout = $timeout;
    var interval = $interval;
    var http = $http;
    // khai báo biến validate trên form edit mode
    $rootScope.validationOptions = [
        {
            Title: 'City',
            rule: {
                Required: true,
                Maxlength: 8,
                Special: true
            },
            message: {
                Required: "Mã (Tỉnh / Thành phố) không được để trống.",
                Maxlength: "Mã (Tỉnh / Thành phố) không được lớn hơn 8 ký tự.",
                Special: 'Mã (Tỉnh / Thành phố) không được có ký tự đặc biệt.'
            },
            Place: "col-md-2"
        },
        {
            Title: 'Title',
            rule: {
                Required: true,
                Maxlength: 25
            },
            message: {
                Required: "Tên (Tỉnh / Thành phố ) không được để trống.",
                Maxlength: "Tên (Tỉnh / Thành phố ) không được lớn hơn 25 ký tự."
            },
            Place: "col-md-6"
        }
    ];
    $scope.title = "Thên mới thông tin (Tỉnh / Thành phố).";
    $scope.model = {
        Status: 1

    };
    // function close dialog
    $scope.ok = function () {
        $uibModalInstance.close();
    };
    // function close dialog
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.submit = function () {
        $rootScope.validateForm($scope.model, function (rs) {
            if (rs) {
                var arrayFile = $scope.model.Attach;
                trong.onBlockUI(idOfDialog, trong.variableMessageBlockUI);
                var post = $http({
                    method: "POST",
                    url: "/" + controller + "/Insert/",
                    dataType: 'json',
                    data: {
                        files: arrayFile,
                        item: $scope.model
                    },
                    headers: { "Content-Type": "application/json" }
                }).then(function (rs) {
                    var result = rs.data;
                    if (isNull(result)) {
                        trong.showMessageError("Không có quyền thực hiện chức năng");
                    } else if (result.Error) {
                        trong.showMessageError(result.Title);
                    } else {
                        trong.showMessageSuccess(result.Title);
                        $rootScope.reload();
                        $scope.cancel();
                    }
                    trong.offBlockUI(idOfDialog);
                });
            }
        }, true);
    }
});
// đây là controller addImport
app.controller('addImport', function ($scope, $http, $uibModalInstance, $rootScope, $timeout, $interval, toaster) {
    //
    var trong = $scope;
    var timeout = $timeout;
    var interval = $interval;
    var http = $http;
    // khai báo biến validate trên form edit mode
    $scope.title = "Thên mới thông tin (Tỉnh / Thành phố) bằng File.";
    // function close dialog
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.submit = function () {
        $rootScope.validateForm($scope.model, function (rs) {
            if (rs) {
                var arrayFile = $scope.model.Attach;
                trong.onBlockUI(idOfDialog, trong.variableMessageBlockUI);
                var post = $http({
                    method: "POST",
                    url: "/" + controller + "/Insert/",
                    dataType: 'json',
                    data: {
                        files: arrayFile,
                        item: $scope.model
                    },
                    headers: { "Content-Type": "application/json" }
                }).then(function (rs) {
                    var result = rs.data;
                    if (isNull(result)) {
                        trong.showMessageError("Không có quyền thực hiện chức năng");
                    } else if (result.Error) {
                        trong.showMessageError(result.Title);
                    } else {
                        trong.showMessageSuccess(result.Title);
                        $rootScope.reload();
                        $scope.cancel();
                    }
                    trong.offBlockUI(idOfDialog);
                });
            }
        }, true);
    }
    
});
// đây là controller edit
app.controller('edit', function ($scope, $http, $uibModalInstance, $rootScope, parameter, toaster, $timeout, $interval) {
    var trong = $scope;
    var timeout = $timeout;
    var interval = $interval;
    var http = $http;
    trong.model = {};
    // khai báo biến validate trên form edit mode
    $rootScope.validationOptions = [
        {
            Title: 'City',
            rule: {
                Required: true,
                Maxlength: 8,
                Special: true
            },
            message: {
                Required: "Mã (Tỉnh / Thành phố) không được để trống.",
                Maxlength: "Mã (Tỉnh / Thành phố) không được lớn hơn 8 ký tự.",
                Special: 'Mã (Tỉnh / Thành phố) không được có ký tự đặc biệt.'
            },
            Place: "col-md-2"
        },
        {
            Title: 'Title',
            rule: {
                Required: true,
                Maxlength: 25
            },
            message: {
                Required: "Tên (Tỉnh / Thành phố ) không được để trống.",
                Maxlength: "Tên (Tỉnh / Thành phố ) không được lớn hơn 25 ký tự."
            },
            Place: "col-md-6"
        }
    ];
    $scope.title = "Cập nhật thông tin (Tỉnh / Thành phố).";
    trong.listSelected = [
        {
            id: undefined,
            title: 'vui lòng chọn...'
        },
        {
            id: 1,
            title: 'item 1'
        },
        {
            id: 2,
            title: 'item 2'
        },
        {
            id: 3,
            title: 'item 3'
        }
    ];
    trong.init = function () {
        trong.onBlockUI(idOfDialog, trong.variableMessageBlockUI);
        http({
            method: "POST",
            url: "/" + controller + "/GetItem/",
            dataType: 'json',
            data: {
                id: parameter,
            },
            headers: { "Content-Type": "application/json" }
        }).then(function (rs) {
            trong.model = rs.data;
            trong.offBlockUI(idOfDialog);
        });
    }
    trong.init();
    trong.submit = function () {
        $rootScope.validateForm($scope.model, function (rs) {
            if (rs) {
                var arrayFile = $scope.model.Attach;
                trong.onBlockUI(idOfDialog, trong.variableMessageBlockUI);
                var post = $http({
                    method: "POST",
                    url: "/" + controller + "/Update/",
                    dataType: 'json',
                    data: {
                        files: arrayFile,
                        item: $scope.model
                    },
                    headers: { "Content-Type": "application/json" }
                }).then(function (rs) {
                    var result = rs.data;
                    if (isNull(result)) {
                        trong.showMessageError("Không có quyền thực hiện chức năng");
                    } else if (result.Error) {
                        trong.showMessageError(result.Title);
                    } else {
                        trong.showMessageSuccess(result.Title);
                        $rootScope.reload();
                        $scope.cancel();
                    }
                    trong.offBlockUI(idOfDialog);
                });
            }
        }, true);

    }
    // function close dialog
    $scope.ok = function () {
        $uibModalInstance.close();
    };
    // function close dialog
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
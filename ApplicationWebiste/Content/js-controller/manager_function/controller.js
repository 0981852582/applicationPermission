app.controller('managerFunction', function ($scope, $rootScope, $timeout, $interval, $uibModal) {
    //
    var trong = $scope;
    // gọi hàm khởi tạo chứa những thông số validate ...
    //    Bắt buộc gọi nếu muốn thực hiện những hành động như validateForm ...
    initValidateForm($rootScope);
    // Hàm thực hiện việc reload lại Datatable bên ngoài index
    $rootScope.reload = function () {
        $rootScope.dataTable.query();
    }
    // function dùng để validate form
    $rootScope.validateForm = function (newvalue) {
        var flag = true;
        var regex = /^[a-zA-Z0-9_]*$/
        newvalue.error = {};
        if (isNull(newvalue.Function1)) {
            newvalue.error.Function1 = "Mã chức năng không được để trống";
            flag = false;
        } else if (!regex.test(newvalue.Function1)) {
            newvalue.error.Function1 = "Mã chức năng không được có ký tự đặc biệt";
            flag = false;
        } else if (newvalue.Function1.length > 50) {
            newvalue.error.Function1 = "Mã chức năng không được nhiều hơn 50 ký tự";
            flag = false;
        }
        if (isNull(newvalue.Title)) {
            newvalue.error.Title = "Tên chức năng không được để trống";
            flag = false;
        } else if (newvalue.Title.length > 30) {
            newvalue.error.Title = "Tên chức năng không được nhiều hơn 30 ký tự";
            flag = false;
        }
        if (isNull(newvalue.Url)) {
            newvalue.error.Url = "URL Link chức năng không được để trống";
            flag = false;
        }
        if (isNull(newvalue.functionCategories)) {
            newvalue.error.functionCategories = "Danh mục chức năng không được để trống";
            flag = false;
        }
        return flag;
    }
    // Khai báo Datatable cho page này
    $rootScope.dataTable = {
        // Page hiện tại của dataTable
        currentPage: trong.settingOfPadding.currentPage,
        // Tính toán xem pagging cần bao nhiêu page vì vậy cần khai báo số lượng item trên 1 page
        maxSize: trong.settingOfPadding.maxSize,
        // Đếm số bản ghi hiện có trong Datatable lấy trong database theo điều kiện chỉ định
        //      hiện tại mặc định là 0 khi với init Datatable
        totalItem: 0,
        // Giới hạn số lượng page hiển thị trong 1 thời điểm
        //      ví dụ đang ở page 1 thì chỉ hiển thị [1 2 3 4 5] nếu đang ở page 5 thì hiển thị [3 4 5 6 7]
        numberPage: trong.settingOfPadding.numberPage,
        // Chứa dữ liệu của Datatable
        values: [],
        // Chứa thông tin tìm kiếm của Datatable
        valueSearch: '',
        // hiện thị thông tin Datatable bên dưới Datatable trên view
        location: trong.settingOfPadding.location,
        // Chứa giá trị trên Field cần xắp xếp hiện tại
        //      Mặc định khi khởi tạo thì lấy giá trị của biến khai báo chung
        orderBy: trong.settingOfPadding.orderBy,
        // Chứa trạng thái Order by là ASC hay là DESC
        //      nếu = true -> ASC
        //      nếu = false -> DESC
        orderType: trong.settingOfPadding.orderType,
        // Hàm thực hiện reload lại Dữ liệu trong Datatable 
        //      làm mới xóa tất cả thông tin tìm kiếm cũng như phân trang trước đó và trở về mặc định
        reload: function () {
            this.currentPage = trong.settingOfPadding.currentPage;
            this.maxSize = trong.settingOfPadding.maxSize;
            this.totalItem = 0;
            this.numberPage = trong.settingOfPadding.numberPage;
            this.values = [];
            this.valueSearch = '';
            this.location = trong.settingOfPadding.location;
            this.query();
        },
        // Sự kiện thay đổi xắp xếp của Datatable
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
        //  Hàm thực hiện call server để lấy dữ liệu theo những thông số hiện tại của Datatable
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
            http.post("/" + controller_Server_ManagerFunction + "/DataTable/", parameter).then(function (rs) {
                if (isNull(rs.data)) {
                    trong.showMessageError(message_Comfirm_Not_Permission);
                } else {
                    this.values = [];
                    $this.values = rs.data.data;
                    $this.totalItem = rs.data.totalItem;
                    $this.location = rs.data.location;
                    trong.offBlockUI('#dataTable');
                }
            });
        }
    };
    trong.dataTable.query();
    trong.checkAll = function () {
        for (var i = 0; i < trong.dataTable.values.length; i++) {
            var item = trong.dataTable.values[i];
            item.isChecked = trong.isCheckAll;
        }
    }
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
        http.post("/" + controller_Server_ManagerFunction + "/updatePermisstion/", trong.Tree_listTreeSelected).then(function (rs) {
            var result = rs.data;
            if (result) {
                trong.showMessageError(message_Comfirm_Not_Permission);
            } else {
                trong.showMessageSuccess(result.Title);
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
                return variable_View_Right_Click_Datatable
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
            text: variable_Edit_Right_Click_Datatable,
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
            text: variable_Delete_Right_Click_Datatable,
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
    // gọi controller add
    trong.dialogAdd = function () {
        /*begin modal*/
        var modalInstance = $uibModal.open({
            templateUrl: folderJs_ManagerFunction + 'add.html',
            controller: 'add',
            backdrop: 'static',
            size: '60',
            resolve: {
            }
        });
    };
    // gọi controller view
    trong.dialogView = function (id) {
        /*begin modal*/
        var modalInstance = $uibModal.open({
            templateUrl: folderJs_ManagerFunction + 'view.html',
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
            templateUrl: folderJs_ManagerFunction + 'edit.html',
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
app.controller('view', function ($scope, $uibModalInstance, $rootScope, parameter, toaster) {
    var trong = $scope;
    $scope.title = "Xem chức năng";
    httpPost(api_ChildOfFunction_GetLookupItem, null,
        function (rs) {
            if (rs != false) {
                $scope.listLookupChildOfFunction = rs.Data;
                trong.init();
            }
        });
    trong.init = function () {
        var objectData = {
            id: parameter
        }
        httpPost(api_ManagerFunction_GetItem, objectData,
            function (rs) {
                trong.model = rs;
                for (var i = 0; i < $scope.listLookupChildOfFunction.length; i++) {
                    var cursor = $scope.listLookupChildOfFunction[i];
                    var checkExists = $scope.model.ArrayFunction.find(x => x == cursor.LookupId);
                    if (checkExists == null) {
                        cursor.isChecked = true;
                    }
                }
                trong.offBlockUI(idOfDialog);
            });
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
app.controller('add', function ($scope, $uibModalInstance, $rootScope, toaster) {
    var trong = $scope;
    trong.model = {};
    trong.title = "Thêm mới chức năng";
    // function close dialog
    trong.ok = function () {
        $uibModalInstance.close();
    };
    trong.triggerValidate = function () {
        trong.$watch("model", function (newvalue, oldvalue) {
            if (newvalue != undefined) {
                $rootScope.validateForm(newvalue);
            }
        }, true);
    }
    trong.onBlockUI(idOfDialog, message_Comfirm_Loading_Data);
    httpPost(api_ChildOfFunction_GetLookupItem, null,
        function (rs) {
            if (rs != false) {
                $scope.listLookupChildOfFunction = rs.Data;
            }
            trong.offBlockUI(idOfDialog);
        });
    httpPost(api_FunctionCategories_GetLookupItem, null,
        function (rs) {
            if (rs != false) {
                $scope.listLookupFunctionCategories = rs.Data;
            }
            trong.offBlockUI(idOfDialog);
        });
    // function close dialog
    trong.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    var indexSubmit = true;
    trong.submit = function () {
        if (indexSubmit) {
            trong.triggerValidate();
            indexSubmit = false;
        }
        if ($rootScope.validateForm(trong.model)) {
            $scope.model.ArrayFunction = [];
            for (var index = 0; index < $scope.listLookupChildOfFunction.length; index++) {
                var cursorItem = $scope.listLookupChildOfFunction[index];
                if (cursorItem.isChecked) {
                    $scope.model.ArrayFunction.push(cursorItem.LookupId);
                }
            }
            var arrayFile = null;
            trong.onBlockUI(idOfDialog, message_Comfirm_Loading_Insert);
            var objectData = {
                files: arrayFile,
                item: trong.model,
                itemExtend: trong.model
            }
            httpPost(api_ManagerFunction_Insert, objectData,
                function (rs) {
                    if (rs != false) {
                        trong.showMessageSuccess(rs.Title);
                        $rootScope.reload();
                        trong.cancel();
                    }
                    trong.offBlockUI(idOfDialog);
                });
        }
    }
});
app.controller('edit', function ($scope, $uibModalInstance, $rootScope, parameter, toaster) {
    var trong = $scope;
    trong.title = "Cập nhật chức năng";
    trong.onBlockUI(idOfDialog, message_Comfirm_Loading_Data);
    httpPost(api_FunctionCategories_GetLookupItem, null,
        function (rs) {
            if (rs != false) {
                $scope.listLookupFunctionCategories = rs.Data;
                httpPost(api_ChildOfFunction_GetLookupItem, null,
                    function (rs) {
                        if (rs != false) {
                            $scope.listLookupChildOfFunction = rs.Data;
                            trong.init();
                        }
                    });
            }
        });
    trong.init = function () {
        var objectData = {
            id: parameter
        }
        httpPost(api_ManagerFunction_GetItem, objectData,
            function (rs) {
                trong.model = rs;
                for (var i = 0; i < $scope.listLookupChildOfFunction.length; i++) {
                    var cursor = $scope.listLookupChildOfFunction[i];
                    var checkExists = $scope.model.ArrayFunction.find(x => x == cursor.LookupId);
                    if (checkExists == null) {
                        cursor.isChecked = true;
                    }
                }
                trong.offBlockUI(idOfDialog);
            });
    }
    trong.triggerValidate = function () {
        trong.$watch("model", function (newvalue, oldvalue) {
            if (newvalue != undefined) {
                $rootScope.validateForm(newvalue);
            }
        }, true);
    }
    var indexSubmit = true;
    trong.submit = function () {
        if (indexSubmit) {
            trong.triggerValidate();
            indexSubmit = false;
        }
        if ($rootScope.validateForm(trong.model)) {
            $scope.model.ArrayFunction = [];
            for (var index = 0; index < $scope.listLookupChildOfFunction.length; index++) {
                var cursorItem = $scope.listLookupChildOfFunction[index];
                if (cursorItem.isChecked) {
                    $scope.model.ArrayFunction.push(cursorItem.LookupId);
                }
            }
            var arrayFile = null;
            trong.onBlockUI(idOfDialog, message_Comfirm_Loading_Insert);
            var objectData = {
                files: arrayFile,
                item: trong.model,
                itemExtend: trong.model
            }
            httpPost(api_ManagerFunction_Update, objectData,
                function (rs) {
                    if (rs != false) {
                        trong.showMessageSuccess(rs.Title);
                        $rootScope.reload();
                        trong.cancel();
                    }
                    trong.offBlockUI(idOfDialog);
                });
        }
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
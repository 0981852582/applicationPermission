app.controller('managerFunction', function ($scope, $rootScope, $http, $timeout, $interval, $uibModal) {
    //
    var trong = $scope;
    var timeout = $timeout;
    var interval = $interval;
    var http = $http;
    var data = [];
    // gọi hàm khởi tạo chứa những thông số validate ...
    //    Bắt buộc gọi nếu muốn thực hiện những hành động như validateForm ...
    initValidateForm($rootScope);
    // Khai báo Datatable cho page này
    trong.dataTable = {
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
    var trong = $scope;
    $scope.title = "Cập nhật thông tin chức năng.";
    trong.title = undefined;
    // function close dialog
    $scope.ok = function () {
        $uibModalInstance.close();
    };
    // function close dialog
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
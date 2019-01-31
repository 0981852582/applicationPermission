app.controller('directoryWards', function ($scope, $rootScope, $uibModal) {
    // thực hiện khai báo các variable cho controller
    var trong = $scope;
    trong.title = 'Quản lý danh mục (Phường / Xã)';
    // gọi hàm khởi tạo chứa những thông số validate ...
    //    Bắt buộc gọi nếu muốn thực hiện những hành động như validateForm ...
    initValidateForm($rootScope);
    // Hàm thực hiện việc reload lại Datatable bên ngoài index
    $rootScope.reload = function () {
        $rootScope.dataTable.query();
    }
    // khai báo biến validate form
    $rootScope.validationOptions = [
        {
            Title: 'Wards',
            rule: {
                Required: true,
                Maxlength: 8,
                Special: true
            },
            message: {
                Required: "Mã (Phường / Xã) không được để trống.",
                Maxlength: "Mã (Phường / Xã) không được lớn hơn 8 ký tự.",
                Special: 'Mã (Phường / Xã) không được có ký tự đặc biệt.'
            },
            Place: "col-md-3"
        },
        {
            Title: 'Title',
            rule: {
                Required: true,
                Maxlength: 25
            },
            message: {
                Required: "Tên (Phường / Xã) không được để trống.",
                Maxlength: "Tên (Phường / Xã) không được lớn hơn 50 ký tự."
            },
            Place: "col-md-5"
        },
        {
            Title: 'District',
            rule: {
                Required: true
            },
            message: {
                Required: "(Quận / Huyện) không được để trống."
            },
            Place: "col-md-3"
        }
    ];
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
        orderType: true,
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
            }
            var parameter = {
                skip: (this.currentPage - 1) * this.numberPage,
                top: this.numberPage,
                orderBy: this.orderBy,
                orderType: this.orderType,
                search: this.valueSearch
            };
            var $this = this;
            trong.onBlockUI(idOfDataTable, message_Comfirm_Loading_Data);
            httpPost(api_Wards_DataTable, parameter,
                function (rs) {
                    if (rs != false) {
                        this.values = [];
                        $this.values = rs.data;
                        $this.totalItem = rs.totalItem;
                        $this.location = rs.location;
                        trong.isCheckAll = false;
                        trong.offBlockUI(idOfDataTable);
                    }
                });
        }
    };
    // Mặc định khi vào page thì load lần đâu tiên cho Datatable
    $rootScope.dataTable.query();
    trong.download = function (id) {
        trong.onBlockUI(idOfDataTable, message_Comfirm_Loading_Download);
        httpDownload(api_Wards_Download, id, function (rs) {
            if (rs != false) {
                window.location.href = api_Wards_Download + id;
            }
            trong.offBlockUI(idOfDataTable);
        });
    }
    // Hàm thực hiện kiểm tra các checkbox trên datatable
    //      thực hiện chọn all hoặc bỏ all trên datatable
    trong.checkAll = function () {
        for (var i = 0; i < trong.dataTable.values.length; i++) {
            var item = trong.dataTable.values[i];
            item.isChecked = trong.isCheckAll;
        }
    }
    // Thực hiện  option chuột trái
    //      Thực hiện hiển thị chuột trái trên datatable với các option tùy chọn
    $scope.menuOptions = [
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
    // Thực hiện gọi call các controller nhỏ hơn trong page
    // gọi controller add
    trong.dialogAdd = function () {
        /*begin modal*/
        var modalInstance = $uibModal.open({
            templateUrl: folderJs_Wards + 'add.html',
            controller: 'add',
            backdrop: 'static',
            size: '60',
            resolve: {
            }
        });
    };
    // gọi controller add
    trong.dialogAddByImport = function () {
        /*begin modal*/
        var modalInstance = $uibModal.open({
            templateUrl: folderJs_Wards + 'addImport.html',
            controller: 'addImport',
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
            templateUrl: folderJs_Wards + 'view.html',
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
            templateUrl: folderJs_Wards + 'edit.html',
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

    // Thực hiện xóa các item datatable
    //      Thực hiện xóa cho từng item trên datatable
    trong.delete = function (id) {
        Comfirm(messageComfirm_Wards_Delete, function (rs) {
            if (rs) {
                trong.onBlockUI(idOfDataTable, message_Comfirm_Loading_Delete);
                var parameter = {
                    id: id,
                }
                httpPost(api_Wards_Delete, parameter,
                    function (rs) {
                        if (rs != false) {
                            trong.showMessageSuccess(rs.Title);
                        }
                        $rootScope.reload();
                    });
            }
        });
    }
    //      Thực hiện xóa nhiều item trên datatable
    trong.deleteArray = function () {
        if (isNotTypeOfArray(trong.dataTable.values)) {
            trong.showMessageError(messageComfirm_Wards_NotExists);
            return;
        }
        var deleteArray = trong.dataTable.values.filter(function (value) { return value.isChecked == true });
        if (deleteArray.length == 0) {
            trong.showMessageError(messageComfirm_Wards_NotExists);
            return;
        }
        var idArray = [];
        for (var i = 0; i < deleteArray.length; i++) {
            idArray.push(deleteArray[i].Id);
        }
        Comfirm(messageComfirm_Wards_Deletes, function (rs) {
            if (rs) {
                trong.onBlockUI(idOfDataTable, message_Comfirm_Loading_Delete);
                var parameter = {
                    idArray: idArray,
                }
                httpPost(api_Wards_Deletes, parameter,
                    function (rs) {
                        if (rs != false) {
                            trong.showMessageSuccess(rs.Title);
                        }
                        $rootScope.reload();
                    });
            }
        });

    }
});

// đây là controller view
app.controller('view', function ($scope, $uibModalInstance, parameter) {
    var trong = $scope;
    trong.title = "Xem thông tin (Phường / Xã).";
    // function close dialog
    trong.ok = function () {
        $uibModalInstance.close();
    };
    trong.init = function () {
        trong.onBlockUI(idOfDialog, message_Comfirm_Loading_Data);
        var parameters = {
            id: parameter
        }
        httpPost(api_Wards_GetItem, parameters, function (rs) {
            trong.model = rs;
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
app.controller('add', function ($scope, $uibModalInstance, $rootScope) {
    //
    var trong = $scope;
    // khai báo biến validate trên form edit mode
    $scope.title = "Thêm mới thông tin (Phường / Xã).";
    $scope.model = {
        Status: 1,
        City: ""
    };
    trong.onBlockUI(idOfDialog, message_Comfirm_Loading_Data);
    httpPost(api_District_GetLookupItem, null,
        function (rs) {
            if (rs != false) {
                $scope.listLookupDistrict = rs.Data;
            }
            trong.offBlockUI(idOfDialog);
        });
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
                var parameter = {
                    parameter: trong.model.Wards
                };
                var exists = httpPostAsync(api_Wards_CountItemByWards, parameter);
                if (exists > 0) {
                    showMessageError(formatString(messageComfirm_Wards_ImportExists, trong.model.Wards));
                    return;
                }
                var arrayFile = $scope.model.Attach;
                trong.onBlockUI(idOfDialog, message_Comfirm_Loading_Insert);
                var objectData = {
                    files: arrayFile,
                    item: $scope.model
                }
                httpPost(api_Wards_Insert, objectData,
                    function (rs) {
                        if (rs != false) {
                            trong.showMessageSuccess(rs.Title);
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
app.controller('addImport', function ($scope, $uibModalInstance, $rootScope) {
    //
    var trong = $scope;
    // khai báo biến validate trên form edit mode
    trong.title = "Thêm mới thông tin (Phường / Xã) bằng File.";
    // function close dialog
    trong.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    // Khai báo Datatable cho page này
    trong.dataTableClient = {
        // Page hiện tại của dataTable
        currentPage: trong.settingOfPaddingClient.currentPage,
        // Top hiện tại
        top: trong.settingOfPaddingClient.top,
        // Skip hiện tại
        skip: trong.settingOfPaddingClient.skip,
        // Tính toán xem pagging cần bao nhiêu page vì vậy cần khai báo số lượng item trên 1 page
        maxSize: trong.settingOfPaddingClient.maxSize,
        // Đếm số bản ghi hiện có trong Datatable lấy trong database theo điều kiện chỉ định
        //      hiện tại mặc định là 0 khi với init Datatable
        totalItem: 0,
        // Giới hạn số lượng page hiển thị trong 1 thời điểm
        //      ví dụ đang ở page 1 thì chỉ hiển thị [1 2 3 4 5] nếu đang ở page 5 thì hiển thị [3 4 5 6 7]
        numberPage: trong.settingOfPaddingClient.numberPage,
        // Chứa dữ liệu của Datatable
        values: [],
        // Chứa thông tin tìm kiếm của Datatable
        valueSearch: '',
        // hiện thị thông tin Datatable bên dưới Datatable trên view
        location: trong.settingOfPaddingClient.location,
        // Chứa giá trị trên Field cần xắp xếp hiện tại
        //      Mặc định khi khởi tạo thì lấy giá trị của biến khai báo chung
        orderBy: trong.settingOfPaddingClient.orderBy,
        // Chứa trạng thái Order by là ASC hay là DESC
        //      nếu = true -> ASC
        //      nếu = false -> DESC
        orderType: true,
        // Hàm thực hiện reload lại Dữ liệu trong Datatable 
        //      làm mới xóa tất cả thông tin tìm kiếm cũng như phân trang trước đó và trở về mặc định
        reload: function () {
            this.currentPage = trong.settingOfPadding.currentPage;
            this.top = trong.settingOfPaddingClient.top;
            this.skip = trong.settingOfPaddingClient.skip;
            this.maxSize = trong.settingOfPadding.maxSize;
            //this.totalItem = 0;
            this.numberPage = trong.settingOfPadding.numberPage;
            //this.values = [];
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
                this.skip = trong.settingOfPaddingClient.skip;
            } else {
                this.skip = (this.currentPage - 1) * this.numberPage,
                    this.top = this.skip + trong.settingOfPaddingClient.top;
            }
            this.location = (this.skip + 1) + " tới " + (this.top) + " trong tổng " + this.totalItem + " bản ghi.";
        }
    };
    trong.$watch('model.listNew', function (newvalue, oldvalue) {
        if (newvalue != undefined) {
            trong.dataTableClient.values = newvalue;
            trong.dataTableClient.totalItem = trong.dataTableClient.values.length;
            trong.dataTableClient.location = (trong.dataTableClient.skip + 1) + " tới " + (trong.dataTableClient.top) + " trong tổng " + trong.dataTableClient.totalItem + " bản ghi.";
        }
    }, true);
    $scope.validateForm = function () {
        trong.onBlockUI(idOfDialog, message_Comfirm_Loading_CheckData);
        var flag = true;
        var limitRequest = 0;
        listWards = [];
        for (var i = 0; i < trong.model.listNew.length; i++) {
            listWards.push(trong.model.listNew[i].Wards);
        }
        var flagValidate = true;
        for (var i = 0; i < trong.model.listNew.length; i++) {
            $rootScope.validateForm(trong.model.listNew[i], function (rs) {
                if (!rs) {
                    trong.model.listNew[i].messageError = message_Error_Validate_Form_Import;
                    trong.model.listNew[i].statusError = true;
                    if (flag) {
                        angular.element('[id="' + trong.model.listNew[i].idDOM + '"]').focus();
                    }
                    flagValidate = false;
                    flag = false;
                }
            }, true);
        }
        if (flagValidate) {
            var fd = new FormData();
            fd.append('parameter', JSON.stringify(listWards));
            trong.onBlockUI(idOfDialog, message_Comfirm_Loading_Insert);
            httpPostFormData(api_Wards_CountItemByWardsByArray, fd, function (rs) {
                if (rs != false) {
                    trong.showMessageSuccess(rs.Title);
                    $rootScope.reload();
                    $scope.cancel();
                }
                trong.offBlockUI(idOfDialog);
            });
        }
        trong.offBlockUI(idOfDialog);
        return flag;
    }
    $scope.submit = function () {
        var listModel = $scope.convertObject();
        var validate = $scope.validateForm();
        if (!validate) {
            return;
        }
        var fd = new FormData();
        fd.append('file', JSON.stringify(listModel));
        trong.onBlockUI(idOfDialog, message_Comfirm_Loading_Insert);
        httpPostFormData(api_Wards_InsertImport, fd, function (rs) {
            if (rs != false) {
                trong.showMessageSuccess(rs.Title);
                $rootScope.reload();
                $scope.cancel();
            }
            trong.offBlockUI(idOfDialog);
        });
    }
    $scope.convertObject = function () {
        var array = [];
        if (isNotNull(trong.model.listNew)) {
            for (var i = 0; i < $scope.model.listNew.length; i++) {
                $scope.model.listNew[i].City = $scope.model.listNew[i]['Mã TP'];
                $scope.model.listNew[i].Wards = $scope.model.listNew[i]['Mã PX'];
                $scope.model.listNew[i].Title = $scope.model.listNew[i]['Phường Xã'];
                $scope.model.listNew[i].District = $scope.model.listNew[i]['Mã QH'];
                $scope.model.listNew[i].TitleDistrict = $scope.model.listNew[i]['Quận Huyện'];
                $scope.model.listNew[i].TitleCity = $scope.model.listNew[i]['Tỉnh Thành Phố'];
                $scope.model.listNew[i].Status = 1;
            }
            for (var i = 0; i < $scope.model.listNew.length; i++) {
                array.push({
                    City: $scope.model.listNew[i]['City'],
                    TitleCity: $scope.model.listNew[i]['TitleCity'],
                    District: $scope.model.listNew[i]['District'],
                    TitleDistrict: $scope.model.listNew[i]['TitleDistrict'],
                    Wards: $scope.model.listNew[i]['Wards'],
                    Title: $scope.model.listNew[i]['Title'],
                    Status: $scope.model.listNew[i]['Status']
                });
            }
        }
        return array;
    }

});
// đây là controller edit
app.controller('edit', function ($scope, $uibModalInstance, $rootScope, parameter) {
    var trong = $scope;
    trong.model = {
        City: ""
    };
    $scope.title = "Cập nhật thông tin (Phường / Xã).";
    trong.onBlockUI(idOfDialog, message_Comfirm_Loading_Data);
    httpPost(api_District_GetLookupItem, null,
        function (rs) {
            if (rs != false) {
                $scope.listLookupDistrict = rs.Data;
            }
            trong.init();
        });
    trong.init = function () {
        var objectData = {
            id: parameter
        }
        httpPost(api_Wards_GetItem, objectData,
            function (rs) {
                trong.model = rs;
                trong.offBlockUI(idOfDialog);
            });
    }
    trong.submit = function () {
        $rootScope.validateForm($scope.model, function (rs) {
            if (rs) {
                var arrayFile = $scope.model.Attach;
                trong.onBlockUI(idOfDialog, message_Comfirm_Loading_Update);
                var objectData = {
                    files: arrayFile,
                    item: $scope.model
                }
                httpPost(api_Wards_Update, objectData,
                    function (rs) {
                        if (rs != false) {
                            trong.showMessageSuccess(rs.Title);
                            $rootScope.reload();
                            $scope.cancel();
                        }
                    });
            }
        }, true);

    }
    // function close dialog
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
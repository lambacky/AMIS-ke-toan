/**
 * tạo đối tượng EmployeePage 
 * Author: Vũ Tùng Lâm (19/10/2022)
 */
$(document).ready(function () {
    new EmployeePage();
});

class EmployeePage {
    formMode=FormMode.Add;
    constructor() {
        this.initEvents();
        this.loadData();
    }

    /**
     * Khởi tạo các events
     * Author: Vũ Tùng Lâm (19/10/2022)
     */
    initEvents(){
        try {
            let self=this;

            //nút mở dialog thêm nhân viên
            $('#btnAddEmployee').click(self.openForm);

            //nút cất nhân viên
            $('#btnSave').click(function(){
                if(self.formMode==FormMode.Add){
                    self.addData();
                }
                if(self.formMode == FormMode.Edit){
                    self.editData();
                }
            });

            //nút cất và thêm nhân viên
            $('#btnSaveAdd').click(function(){
                if(self.formMode==FormMode.Add){
                    self.formMode=FormMode.SaveAndAdd;
                    self.addData();
                }
                if(self.formMode == FormMode.Edit){
                    self.formMode=FormMode.SaveAndAdd;
                    self.editData();
                }
            });

            //nút hủy dialog
            $('.btn-close').click(function(){self.closeDialog($(this))});

            //tabOrder chuyển từ nút cuối cùng quay về nút đầu tiên
            $('.btn-close').keydown(function(event){
                $(this).parents('.dialog-wrapper').find('[tabindex="1"]').focus();
                event.preventDefault();
            });

            //nút thoát form thông tin nhân viên
            $('#btnEsc').click(function(){
                // Lấy form data
                let formData = $('#employeeForm').serializeArray().reduce(function (obj, item) {
                    obj[item.name] = item.value;
                    return obj;
                }, {});

                //kiểm tra dữ liệu thay đổi
                if (JSON.stringify(formData) !== JSON.stringify($('#formDialog').data('formData'))) {
                    $('.alert-question').show();
                    $('.alert-question').find('[tabindex="1"]').focus();
                } else {
                    self.closeDialog($(this));
                }
            });
            
            //xử lí các nút trong alert question
            self.handleQuestionDialog();
            
            //nút chỉnh sửa form  thông tin nhân viên
            $(document).on('click','.modify',function(){
                self.modifyForm($(this));
            });

            //double click cho hàng của bảng danh sách nhân viên
            $(document).on('dblclick','tbody tr td:not(:first-child,:last-child)',function(){
                self.modifyForm($(this));
            });
            
            // nút refresh dữ liệu bảng danh sách nhân viên
            $(document).on('click','#btnRefresh',self.loadData);
            
            //xử lí combobox
            self.handleComboBox();

            //xử lí dropdown
            self.handleDropdown();

        } catch (error) {
            console.log(error);
        }
        
    }

    /**
     * Thực hiện load dữ liệu
     * Author: Vũ Tùng Lâm 23/10/2022
     */
    loadData(){
        let self=this;
        try {
            $.ajax({
                type: 'GET',
                url: 'https://amis.manhnv.net/api/v1/employees',
                success: function (response) {
                    $('tbody').empty();
                    for(const emp of response){
                        var dob = emp.DateOfBirth;
                        if (dob) {
                            dob = new Date(dob);
                            // Lấy ngày
                            let date = dob.getDate();
                            date = date < 10 ? `0${date}` : date;
                            // Lấy tháng
                            let month = dob.getMonth() + 1;
                            month = month < 10 ? `0${month}` : month;
                            // Lấy năm
                            let year = dob.getFullYear();
    
                            dob = `${date}/${month}/${year}`;
                        }
                        var trHTML = $(
                            `<tr>
                                <td>
                                    <input class="input-checkbox" type="checkbox">
                                </td>
                                <td id="employeeCodeCell">${emp.EmployeeCode || ''}</td>
                                <td>${emp.EmployeeName || ''}</td>
                                <td>${emp.GenderName || ''}</td>
                                <td class="date">${dob ? dob : ''}</td>
                                <td>${emp.EmployeePosition || ''}</td>
                                <td>${emp.IdentityNumber || ''}</td>
                                <td>${emp.DepartmentName || ''}</td>
                                <td>${emp.BankAccountNumber || ''}</td>
                                <td>${emp.BankName || ''}</td>
                                <td>${emp.BankBranchName || ''}</td>
                                <td>
                                    <div class="table-function">
                                        <div class="modify">Sửa</div>
                                        <div class="dropdown context-menu">
                                            <div class="icon dropdown-button icon-arrow-down-blue"></div>
                                            <div class="dropdown-list">
                                                <div class="dropdown-item">Nhân bản</div>
                                                <div class="dropdown-item delete-item">Xóa</div>
                                                <div class="dropdown-item">Ngưng sử dụng</div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>`
                        );
                        $(trHTML).data('employee', emp);
                        $('tbody').append(trHTML);
                    }
                    self.handleTable();
                    //handleDropdown();
                    $('#totalNumber').text(response.length);
                },
                error: function (response) {
                    console.log(response);
                },
            });
    
            $.ajax({
                type: 'GET',
                url: 'https://amis.manhnv.net/api/v1/Departments',
                success: function (response) {
                    // debugger
                    $('#departmentList').empty();
                    for (const department of response) {
                        var divHTML = $(`<div class="data-item department-item">${department.DepartmentName}</div>`);
                        $(divHTML).data('department', department);
                        $('#departmentList').append(divHTML);
                    }   
                },
                error: function (response) {
                    console.log(response);
                },
            });
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Xác minh dữ liệu
     * Author: Vũ Tùng Lâm (19/10/2022)
     */
    validateData(){
        var isValid = true;
        var inputValidates = [];
        // dữ liệu bắt buộc nhập
        var inputRequireds = $('.required');
        inputRequireds.each(function(){
            let input = $(this);
            inputValidates.push(input);
            let value = input.val();
            let errorMess = input.next();
            if(!value){
                input.addClass('input-error');
                errorMess.show();
                errorMess.prop('title',errorMess.text());
                isValid = false;
            }
            else{
                input.removeClass('input-error');
                errorMess.hide();
    
            }
        });
    
        //ngày tháng
        var inputDates = $('.input-date');
        var currentDate = (new Date()).toISOString().split('T')[0];
        inputDates.each(function(){
            let input = $(this);
            inputValidates.push(input);
            let value = input.val();
            let errorMess = input.next();
            if(value > currentDate){
                input.addClass('input-error');
                errorMess.show();
                errorMess.prop('title',errorMess.text());
                isValid = false;
            }
            else{
                input.removeClass('input-error');
                errorMess.hide();
            }
        });
    
        //kiểm tra đúng định dạng(email)
        var inputEmail = $('#email');
        inputValidates.push(inputEmail);
        var mailErrorMess = inputEmail.next();
        var mailValue = inputEmail.val();
        var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(mailValue){
            if(!mailValue.match(mailFormat)){
                inputEmail.addClass('input-error');
                mailErrorMess.show();
                errorMess.prop('title',errorMess.text());
                isValid = false;
            }
            else{
                inputEmail.removeClass('input-error');
                mailErrorMess.hide();
            }
        }
        
        //hiện dialog lỗi
        $.each(inputValidates,function(){
            let input = $(this);
            let errorMess = input.next();
            if (errorMess.css('display')=='block'){
               let alertDanger = $('.alert-danger');
                alertDanger.show();
                alertDanger.find('.content-message').text(errorMess.text());
                alertDanger.find('.btn-close').focus();
                return false;
            }
        });
    
        return isValid;
    }

    /**
     * Thực hiện lưu dữ liệu
     * Author: Vũ Tùng Lâm (19/10/2022)
     */
    addData(){
        try {
            let self=this;
            //validate dữ liệu
            let isValid = self.validateData();
            if(isValid){
                
                //Thu thập dữ liệu
                let formData = $('#employeeForm').serializeArray().reduce(function (obj, item) {
                    obj[item.name] = item.value;
                    return obj;
                }, {});
                let employee = {
                    EmployeeCode: null,
                    FirstName: null,
                    LastName: null,
                    EmployeeName: null,
                    Gender: 0,
                    DateOfBirth: null,
                    PhoneNumber: null,
                    Email: null,
                    Address: null,
                    IdentityNumber: null,
                    IdentityDate: null,
                    IdentityPlace: null,
                    JoinDate: null,
                    MartialStatus: null,
                    EducationalBackground: null,
                    QualificationId: null,
                    DepartmentId: null,
                    PositionId: null,
                    WorkStatus: null,
                    PersonalTaxCode: null,
                    Salary: null,
                    TelephoneNumber: null,
                    BankAccountNumber: null,
                    BankName: null,
                    BankBranchName: null,
                    BankProvinceName: null,
                    EmployeePosition: null,
                    PositionCode: null,
                    PositionName: null,
                    DepartmentCode: null,
                    DepartmentName: null,
                    QualificationName: null,
                    GenderName: null,
                    EducationalBackgroundName: null,
                    MartialStatusName: null,
                    CreatedDate: null,
                    CreatedBy: null,
                    ModifiedDate: null,
                    ModifiedBy: null,
                };
                employee = { ...employee, ...formData };
                
                //gọi api thực hiện cất dữ liệu
                $('#loading').show();
                
                $.ajax({
                    type: 'POST',
                    url: 'https://amis.manhnv.net/api/v1/employees',
                    data: JSON.stringify(employee),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (response) {
                        $('#loading').hide();
                        $('#formDialog').find('.btn-close').click();
                        if(self.formMode==FormMode.SaveAndAdd){
                            self.formMode = FormMode.Add;
                            self.openForm("Thêm khách hàng");
                        }
                        self.loadData();
                    },
                    error: function (response) {
                        $('#loading').hide();
                        switch (response.status) {
                            case 400:
                                let dangerMessage = response.responseJSON.userMsg;
                                $('.alert-danger .content-message').html(dangerMessage);
                                $('.alert-danger').show();
                                $('.alert-danger').find('.btn-close').focus();
                                break;
                            default:
                                break;
                        }
                    },
                });
                //kiểm tra kết quả trả về
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Thực hiện sửa đổi dữ liệu
     * Author: Vũ Tùng Lâm (23/10/2022)
     */
    editData(){
        let self = this;
        // 2. Validation dữ liệu
        let isValid = this.validateData();
        if (isValid) {
            // 3. Xử lý dữ liệu
            let formData = $('#employeeForm').serializeArray().reduce(function (obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            let employee = $('#formDialog').data('employee');
            employee = { ...employee, ...formData };
            $('#loading').show();
            $.ajax({
                type: 'PUT',
                url: `https://amis.manhnv.net/api/v1/Employees/${employee.EmployeeId}`,
                data: JSON.stringify(employee),
                dataType: 'json',
                contentType: 'application/json',
                success: function (response) {
                    $('#loading').hide();
                    $('#formDialog').find('.btn-close').click();
                    if(self.formMode==FormMode.SaveAndAdd){
                        self.formMode = FormMode.Add;
                        self.openForm("Thêm khách hàng");
                    }
                    self.loadData();
                },
                error: function (response) {
                    $('#loading').hide();
                    // Show dialog nếu có lỗi
                    switch (response.status) {
                        case 400:
                            let dangerMessage = response.responseJSON.userMsg;
                                $('.alert-danger .content-message').html(dangerMessage);
                                $('.alert-danger').show();
                                $('.alert-danger').find('.btn-close').focus();
                            break;
                        default:
                            break;
                    }
                },
            });
        }
    }

    /**
     * Thực hiện việc xóa dữ liệu
     * @param {*} id 
     * Author: Vũ Tùng Lâm (23/10/2022)
     */
    deleteData(id){
        let self=this;
        try {
            $.ajax({
                type: 'DELETE',
                url: `https://amis.manhnv.net/api/v1/Employees/${id}`,
                success: function (response) {
                    $('#loading').hide();
                    self.loadData();
                },
                error: function () {
                    $('#loading').hide();
                },
            });
        } catch (error) {
            console.log(error);
        }
    }
    
    /**
     * Thực hiện mở form dialog
     * Author: Vũ Tùng Lâm (20/10/2022)
     */
    
    openForm() {
        try {
            let self = this;
            self.formMode = FormMode.Add;
            $('#loading').show();

            //mở form

            //lấy employeecode
            $.ajax({
                type: 'GET',
                url: 'https://amis.manhnv.net/api/v1/Employees/NewEmployeeCode',
                success: function (response) {
                    $('input[name="EmployeeCode"]').val(response);
                    $('#loading').hide();
                    $('#formDialog').show();
                    $('#formTitle').text("Thêm khách hàng");
                    $('#employeeCode').focus();

                    // Lấy dữ liệu form
                    let formData = $('#employeeForm').serializeArray().reduce(function (obj, item) {
                        obj[item.name] = item.value;
                        return obj;
                    }, {});
                    $('#formDialog').data('formData', formData);
                },
                error: function (response) {
                    console.log(response);
                },
            });
            
            
        } catch (error) {
            console.log(error);
        }

    }
    
    /**
     * Thực hiện chỉnh sửa form dialog
     * Author: Vũ Tùng Lâm (20/10/2022)
     */
    modifyForm(cell) {
        let self = this;
        
        //mở form dialog
        self.formMode = FormMode.Edit;
        $('#formDialog').show();
        $('#formTitle').text("Sửa khách hàng");
        $('#employeeCode').focus();

        //hiện dữ liệu của nhân viên lên dialog

        //lấy dữ liệu nhân viên từ bảng
        let employee = cell.parents('tr').data('employee');

        var inputs = $('#employeeForm').find('input:not([name="Gender"])');
        // Gán value cho các input
        for (let input of inputs) {
            let name = $(input).attr('name');
            let value = employee[name];
            if ($(input).attr('type') == 'date' && value) {
                $(input).val(value.split('T')[0]);
            } else {
                $(input).val(value);
            }
        }
        // Gán value cho input Gender
        $('input[name="Gender"]').each(function () {
            if (employee.Gender!= null) {
                if ($(this).val() == employee.Gender.toString()) {
                    $(this).prop('checked', true);
                }
            }
        });
        let formData = $('#employeeForm').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        $('#formDialog').data('formData', formData);
        $('#formDialog').data('employee', employee);
    }
    
    /**
     * Thực hiện đóng dialog
     * @param {*} btnClose
     * Author: Vũ Tùng Lâm (20/10/2022) 
     */
    closeDialog(btnClose){
        var dialog = btnClose.parents('.dialog-wrapper');     
        dialog.hide();

        //kiểm tra nếu dialog là form thông tin nhân viên
        if(dialog.prop('id')=="formDialog"){
            //reset form
            dialog.find('.input-error').removeClass('input-error');
            dialog.find('.input-error-mess').hide();
            dialog.find('input[name="Gender"][value="1"]').prop('checked', true);
            dialog.find('input:not([name="Gender"])').val('');
        }
    }
    
    /**
     * Xử lí bảng
     * Author: Vũ Tùng Lâm (20/10/2022)
     */
     handleTable(){
        let self=this;
        var tableCheckboxes = $('#empTable').find('.input-checkbox:not(#checkboxAll)');
        var checkboxAll = $('#checkboxAll');
        
        // xử lí checkbox all của bảng
        checkboxAll.change(function(){
            self.handleCheckAll(tableCheckboxes,checkboxAll);
        });
    
        //xử lí các checkbox của bảng
        tableCheckboxes.change(function(){
            self.anyCheckedBoxTable(tableCheckboxes,checkboxAll);
        });
    
        // xử lí double click của hàng
        
    
        // xử lí z-index của cột cuối cùng
        var lastCells = $('tbody tr td:last-child');
        var headCells = $('thead tr th');
        var z = lastCells.length;
        headCells.css('z-index',z);
        headCells.first().css('z-index',z+1);
        lastCells.each(function(){
            $(this).css('z-index',z-1);
            z--;
        })
    }
    
    /**
     * Xử lí checkbox all của bảng
     * @param {*} tableCheckboxes 
     * @param {*} checkboxAll
     * Author: Vũ Tùng Lâm (20/10/2022)
     */
    handleCheckAll(tableCheckboxes,checkboxAll){
        tableCheckboxes.prop('checked',checkboxAll.prop('checked'));
        this.anyCheckedBoxTable(tableCheckboxes,checkboxAll);
    }
    
    /**
     * Xử lí các checkbox trong bảng
     * @param {*} tableCheckboxes 
     * @param {*} checkboxAll 
     */
    anyCheckedBoxTable(tableCheckboxes,checkboxAll){
        let checkeds = $('#empTable').find('.input-checkbox:not(#checkboxAll):checked').length;
        checkboxAll.prop('checked',(checkeds == tableCheckboxes.length));
        $('#btnDelete').prop('disabled', (checkeds == 0));
    }
    
    /**
     * xử lí combobox
     * Author: Vũ Tùng Lâm (20/10/2022)
     */
    handleComboBox(){
        var comboboxes = $('.combobox');
        comboboxes.each(function(){
            let combobox = $(this);
            let comboboxButton = combobox.find('.combobox-button');
            let comboboxInput = combobox.find('.combobox-input');
            let comboboxData = combobox.find('.combobox-data');
    
            // Ẩn/hiện comboboxData
            comboboxButton.click(function(){comboboxData.toggle()});
    
            // Chọn item từ comboboxData
            comboboxData.on('click','.data-item',function(){
                comboboxData.find('.checked').removeClass('checked');
                $(this).addClass('checked');
                comboboxInput.val($(this).text());
                if (comboboxInput.is('#departmentName')){
                    let department = $(this).data('department');
                    $('#departmentId').val(department.DepartmentId);
                }
                comboboxData.hide();
            });
        });
    }
    
    /**
     * xử lí dropdown
     * Author: Vũ Tùng Lâm (20/10/2022)
     */
    handleDropdown(){
        let self =this;
        var deleteWarning = $('.alert-warning-delete');
        var employee="";
    
        // Ẩn/hiện dropdown xóa nhân viên
        $('table').on('click','.dropdown-button',function(){
            // $(this).siblings('.dropdown-list').toggle();
            let dropdownList = $(this).siblings();
            dropdownList.toggle();
        });
    
        //chọn xóa nhân viên
        $('table').on('click','.delete-item',function(){
            employee = $(this).parents('tr').data('employee');
            let employeeCode= $(this).parents('tr').find('#employeeCodeCell').text();
    
            //hiện dialog cảnh báo việc xóa nhân viên
            deleteWarning.find('.content-message').text(`Bạn có thực sự muốn xóa Nhân viên <${employeeCode}> không?`);
            deleteWarning.show();
            deleteWarning.find('[tabindex="1"]').focus();
        })
    
        deleteWarning
        .on('click','.btn-deny',function(){
            deleteWarning.hide();
        })
        .on('click','.btn-confirm',function(){
            $('#loading').show();
            deleteWarning.hide();
            self.deleteData(employee.EmployeeId);
            
        });
    }

    /**
     * Xử lí các nút trong alert question
     * Author: Vũ Tùng Lâm (23/10/2022)
     */
    handleQuestionDialog(){
        var alertQuestion = $('.alert-question');
        alertQuestion
        .on('click','.btn-deny',function(){
            alertQuestion.hide();
            $('#formDialog').find('.btn-close').click();
        })
        .on('click','.btn-confirm',function(){
            alertQuestion.hide();
            $('#btnSave').click();
        })
    }
    
}

/**
 * Các chế độ của form : Thêm, Sửa, Cất và Thêm
 * Author: Vũ Tùng Lâm (23/10/2022)
 */
var FormMode = {
    Add: 1,
    Edit: 2,
    SaveAndAdd: 3,
};

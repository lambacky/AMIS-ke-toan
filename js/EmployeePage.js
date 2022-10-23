$(document).ready(function () {
    new EmployeePage();
});

class EmployeePage {
    constructor() {
        initEvents();
        loadData();
    }
}

/**
 * Khởi tạo các events
 * Author: Vũ Tùng Lâm (19/10/2022)
 */
function initEvents(){
    try {
        $('#btnAddEmployee').click(function(){openForm('Thêm khách hàng')});
        $(document).on('click','.modify',modifyForm);
        // $('#btnSave').click(addData);
        $('.btn-close').click(function(){closeDialog($(this))});
        $('.btn-close').keydown(function(event){event.preventDefault()});
        $(document).on('click','#btnRefresh',loadData);
        handleComboBox();
        handleDropdown();
        handleForm();
    } catch (error) {
        console.log(error);
    }
    
}
function handleForm(){
    var formDialog = $('#formDialog');
    formDialog
    .on('click','.btn-close',function(){
        formDialog.find('.input-error').removeClass('input-error');
        formDialog.find('.input-error-mess').hide();
        $('input[name="Gender"][value="1"]').prop('checked', true);
        formDialog.find('input:not([name="Gender"])').val('');
        formDialog.hide();
    })
    .on('click','#btnSave',function(){
        addData();
    })
}
function loadData(){
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
                handleTable();
                //handleDropdown();
                $('#totalNumber').text(response.length);
            }
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
            }
        });
    } catch (error) {
        console.log(error);
    }
}

/**
 * Xử lí bảng
 * Author: Vũ Tùng Lâm (20/10/2022)
 */
function handleTable(){
    var tableCheckboxes = $('#empTable').find('.input-checkbox:not(#checkboxAll)');
    var checkboxAll = $('#checkboxAll');
    
    // xử lí checkbox all của bảng
    checkboxAll.change(function(){
        handleCheckAll(tableCheckboxes,checkboxAll);
    });

    //xử lí các checkbox của bảng
    tableCheckboxes.change(function(){
        anyCheckedBoxTable(tableCheckboxes,checkboxAll);
    });

    // xử lí double click của hàng
    $('tbody tr td:not(:first-child,:last-child)').dblclick(modifyForm);

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
 * @param {array} tableCheckboxes 
 * @param {object} checkboxAll
 * Author: Vũ Tùng Lâm (20/10/2022)
 */
function handleCheckAll(tableCheckboxes,checkboxAll){
    tableCheckboxes.prop('checked',checkboxAll.prop('checked'));
    anyCheckedBoxTable(tableCheckboxes,checkboxAll);
}


/**
 * 
 * @param {array} tableCheckboxes 
 * @param {object} checkboxAll 
 */
function anyCheckedBoxTable(tableCheckboxes,checkboxAll){
    let checkeds = $('#empTable').find('.input-checkbox:not(#checkboxAll):checked').length;
    checkboxAll.prop('checked',(checkeds == tableCheckboxes.length));
    $('#btnDelete').prop('disabled', (checkeds == 0));
}


/**
 * Thực hiện mở dialog
 * Author: Vũ Tùng Lâm (20/10/2022)
 */

function openForm(title) {
    $('#loading').show();
    setTimeout(function () {
        $('#loading').hide();
        $('#formDialog').show();
        $('#formTitle').text(title);
        $('#employeeCode').focus();
    }, 1000);
}

/**
 * Thực hiện chỉnh sửa dialog
 * Author: Vũ Tùng Lâm (20/10/2022)
 */
function modifyForm() {
    openForm("Sửa khách hàng");

    //hiện dữ liệu của nhân viên lên dialog
    
}

/**
 * Thực hiện lưu dữ liệu
 * Author: Vũ Tùng Lâm (19/10/2022)
 */
function addData(){
    //validate dữ liệu
    var isValid = validateData();
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
            Gender: null,
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
        $('.loading').show();
        try {
            $.ajax({
                type: 'POST',
                url: 'https://amis.manhnv.net/api/v1/employees',
                data: JSON.stringify(employee),
                dataType: 'json',
                contentType: 'application/json',
                success: function (response) {
                    $('.loading').hide();
                    $('#formDialog').hide();
                    // $('.m-add-popup input:not([name="Gender"])').val('');
                    // Load lại dữ liệu trên table
                    loadData();
                    // Hiển thị dialog thêm thành công
                    // $('.m-employee-success .m-content-message').text('Thêm nhân viên thành công');
                    // $('.m-employee-success').show();
                },
                error: function (response) {
                    $('.m-loading').hide();
                    switch (response.status) {
                        case 400:
                            let dangerMessage = response.responseJSON.userMsg;
                            $('.alert-danger .content-message').html(dangerMessage);
                            $('.alert-danger').show();
                            break;
                        default:
                            break;
                    }
                },
            });
        } catch (error) {
            console.log(error);
        }

        //kiểm tra kết quả trả về
    }
}

/**
 * Thực hiện đóng dialog
 * @param {object} btnClose
 * Author: Vũ Tùng Lâm (20/10/2022) 
 */
 function closeDialog(btnClose){
    btnClose.parents('.dialog-wrapper').hide();
}

/**
 * Xác minh dữ liệu
 * Author: Vũ Tùng Lâm (19/10/2022)
 */
function validateData(){
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
        let label = input.prev();
        let errorMess = input.next();
        // if(!value){
        //     input.addClass('input-error');
        //     errorMess.show();
        //     errorMess.text('<' + label.text()+ '> không đúng định dạng');
        if(value > currentDate){
            input.addClass('input-error');
            errorMess.show();
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
            return false;
        }
    });

    return isValid;
}

/**
 * xử lí combobox
 * Author: Vũ Tùng Lâm (20/10/2022)
 */
function handleComboBox(){
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
            chooseItem($(this), comboboxData, comboboxInput);
        });
    });
}


/**
 * Chọn item từ comboboxData
 * @param {object} item 
 * @param {object} comboboxData 
 * @param {object} comboboxInput
 * Author: Vũ Tùng Lâm (20/10/2022)
 */
function chooseItem(item, comboboxData, comboboxInput){
    comboboxData.find('.checked').removeClass('checked');
    item.addClass('checked');
    comboboxInput.val(item.text());
    if (comboboxInput.is('#departmentName')){
        let department = item.data('department');
        $('#departmentId').val(department.DepartmentId);
    }
    comboboxData.hide();
}


/**
 * xử lí dropdown
 * Author: Vũ Tùng Lâm (20/10/2022)
 */
function handleDropdown(){
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
        employeeCode= $(this).parents('tr').find('#employeeCodeCell').text();

        //hiện dialog cảnh báo việc xóa nhân viên
        deleteWarning.find('.content-message').text(`Bạn có thực sự muốn xóa Nhân viên <${employeeCode}> không?`);
        deleteWarning.show();
    })

    deleteWarning
    .on('click','.btn-deny',function(){
        deleteWarning.hide();
    })
    .on('click','.btn-confirm',function(){
        $('#loading').show();
        deleteWarning.hide();
        deleteData(employee.EmployeeId);
    });
}


/**
 * Thực hiện việc xóa nhân viên
 * @param {*} id 
 * Author: Vũ Tùng Lâm (23/10/2022)
 */
function deleteData(id){
    try {
        $.ajax({
            type: 'DELETE',
            url: `https://amis.manhnv.net/api/v1/Employees/${id}`,
            success: function (response) {
                $('#loading').hide();
                loadData();
                // Hiển thị dialog xóa thành công
                // $('.m-employee-success .m-content-message').text('Xóa nhân viên thành công');
                // $('.m-employee-success').show();
            },
            error: function () {
            },
        });
    } catch (error) {
        console.log(error);
    }
}




var FormMode = {
    Add: 1,
    Edit: 2,
    SaveAndAdd: 3,
    EditAndAdd: 4,
};

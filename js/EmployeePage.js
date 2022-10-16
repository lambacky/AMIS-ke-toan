var comboboxs = document.getElementsByClassName("combobox");
var checkedItem = [];
var comboboxInput = [];
for (var i = 0; i < comboboxs.length; i++) {
    checkedItem[i] = comboboxs[i].getElementsByClassName("combobox-data")[0].getElementsByClassName("data-item")[0];
    checkedItem[i].classList.add("checked");
    comboboxInput[i] = comboboxs[i].getElementsByClassName("combobox-input")[0];
    comboboxInput[i].value = checkedItem[i].innerHTML;
}

for (let i = 0; i < comboboxs.length; i++) {
    let comboboxButton = comboboxs[i].getElementsByClassName("combobox-button")[0];
    // let comboboxInput = comboboxs[i].getElementsByClassName("combobox-input")[0];
    let comboboxData = comboboxs[i].getElementsByClassName("combobox-data")[0];
    let dataItems = comboboxData.getElementsByClassName("data-item");
    // checkedItem[i] = dataItems[0];
    // checkedItem[i].classList.add("checked");
    // comboboxInput.innerHTML=checkedItem[i].innerHTML;

    comboboxButton.addEventListener('click', function onClick() {
        toggleList(comboboxData);
    });
    for (let j = 0; j < dataItems.length; j++) {
        let item = dataItems[j];
        item.addEventListener("click", function () {
            chooseItem(item, comboboxData, i);
        })
    }
}

function chooseItem(item, comboboxData, i) {
    checkedItem[i].classList.remove("checked");
    checkedItem[i] = item;
    comboboxInput[i].value = checkedItem[i].innerHTML;
    checkedItem[i].classList.add("checked");
    comboboxData.style.display = "none";
}


function changeColor(comboboxData) {
    comboboxData.style.backgroundColor = "red";
}

function loading() {
    document.getElementById("loading").style.display = "block";
}

function openForm() {
    loading();
    setTimeout(function () {
        document.getElementById("loading").style.display = "none";
        document.getElementById("dialog-wrapper").style.display = "block";
        document.getElementById("dialog-title").innerHTML = "Thêm khách hàng";
        document.getElementById("emp-id").focus();
    }, 1000);
}

function modifyForm() {
    loading();
    setTimeout(function () {
        document.getElementById("loading").style.display = "none";
        document.getElementById("dialog-wrapper").style.display = "block";
        document.getElementById("dialog-title").innerHTML = "Sửa khách hàng";
        document.getElementById("emp-id").focus();
    }, 1000);
}
function closeForm() {
    document.getElementById("dialog-wrapper").style.display = "none";
}

function toggleList(comboboxData) {
    if (comboboxData.style.display === "block") {
        comboboxData.style.display = "none";
    } else {
        comboboxData.style.display = "block";
    }
}
function showAlert(){
    document.getElementsByClassName("alert-danger")[0].style.display="block";
}




var empTableRows = document.getElementById("emp-table").rows;
var n = empTableRows.length;
var m = empTableRows[0].cells.length;
empTableRows[0].cells[0].style.zIndex=n;
for (let i = 0; i < n; i++) {
    empTableRows[i].cells[m-1].style.zIndex = n-1-i;
    for(let j=1;j<m-1;j++) {
        empTableRows[i].cells[j].addEventListener("dblclick", function(){
            openForm();
        })
    }
}

for(let j=1;j<m-1;j++){
    empTableRows[0].cells[j].style.zIndex = n-1;
}


var dropdowns = document.getElementsByClassName("dropdown");
for (let i = 0; i < dropdowns.length; i++) {
    let dropdownButton = dropdowns[i].getElementsByClassName("dropdown-button")[0];
    let dropdownList = dropdowns[i].getElementsByClassName("dropdown-list")[0];
    dropdownButton.addEventListener("click", function () {
        toggleList(dropdownList);
    });

}
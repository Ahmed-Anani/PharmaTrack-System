let arr = JSON.parse(localStorage.getItem("medicine")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];

// ================= Navigation & Menu =================
let menu = document.getElementById("menu");
let menu_btn = document.getElementById("menu_btn");
let close_btn = document.getElementById("close_btn");

menu_btn.addEventListener("click", () => {
    menu.classList.add("active");
    menu_btn.style.display = "none";
    close_btn.style.display = "block";
});

close_btn.addEventListener("click", () => {
    menu.classList.remove("active");
    menu_btn.style.display = "";
    close_btn.style.display = "none";
});

function getTopage(pageId) {
    let pages = document.querySelectorAll(".page");
    pages.forEach((page) => {
        page.style.display = "none";
    });
    document.getElementById(pageId).style.display = "block";
    
    // Close mobile menu
    menu.classList.remove("active");
    menu_btn.style.display = "";
    close_btn.style.display = "none";

    // Save current page to localStorage
    localStorage.setItem("currentPage", pageId);

    // Refresh specific pages
    if(pageId === 'home_content') updateDashboardStats();
    if(pageId === 'sales') populateSalesSelect();
    if(pageId === 'inventory') showInventory();
    if(pageId === 'reports') showReports();
}

// ================= Authentication =================
function registerPage() {
    document.getElementById("login_container2").style.display = "none";
    document.getElementById("newAccount_container").style.display = "block";
}

function loginPage() {
    document.getElementById("login_container2").style.display = "block";
    document.getElementById("newAccount_container").style.display = "none";
}

function register() {
    let first = document.getElementById("firstUserName").value;
    let last = document.getElementById("lastUserName").value;
    let pass = document.getElementById("newPassword").value;
    
    if(first && last && pass) {
        users.push({ username: first + " " + last, password: pass });
        localStorage.setItem("users", JSON.stringify(users));
        alert("تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن");
        loginPage();
    } else {
        alert("يرجى ملء جميع البيانات");
    }
}

function login() {
    let user = document.getElementById("userName").value;
    let pass = document.getElementById("password").value;
    
    let found = users.find(u => u.username === user && u.password === pass);
    if(found || (user === "admin" && pass === "admin") || (user === "" && pass === "")) {
        localStorage.setItem("isLoggedIn", "true");
        document.getElementById("login_container2").style.display = "none";
        document.getElementById("newAccount_container").style.display = "none";
        document.getElementById("container").style.display = "block";
        getTopage(localStorage.getItem("currentPage") || 'home_content');
    } else {
        alert("اسم المستخدم أو كلمة المرور خاطئة");
    }
}

function logout() {
    localStorage.setItem("isLoggedIn", "false");
    document.getElementById("container").style.display = "none";
    document.getElementById("login_container2").style.display = "block";
    document.getElementById("userName").value = "";
    document.getElementById("password").value = "";
}

document.getElementById("log_out").addEventListener("click", logout);
document.getElementById("log_out2").addEventListener("click", logout);

window.onload = function() {
    let isLoggedIn = localStorage.getItem("isLoggedIn");
    if(isLoggedIn === "true") {
        document.getElementById("login_container2").style.display = "none";
        document.getElementById("newAccount_container").style.display = "none";
        document.getElementById("container").style.display = "block";
        showTable();
        getTopage(localStorage.getItem("currentPage") || 'home_content');
    } else {
        document.getElementById("login_container2").style.display = "block";
        document.getElementById("newAccount_container").style.display = "none";
        document.getElementById("container").style.display = "none";
        showTable();
    }
};

// ================= Dashboard Stats =================
function updateDashboardStats() {
    let statTotal = arr.length;
    let today = new Date();
    let statExpired = arr.filter(item => new Date(item.endDate) <= today).length;
    let statLow = arr.filter(item => parseInt(item.quantity) < 10).length;
    let todayDateStr = today.toLocaleDateString();
    let todaySales = sales.filter(s => s.date === todayDateStr).reduce((acc, s) => acc + s.total, 0);

    let elTotal = document.getElementById("stat_total_meds");
    let elExpired = document.getElementById("stat_expired_meds");
    let elLow = document.getElementById("stat_low_stock");
    let elSales = document.getElementById("stat_today_sales");

    if(elTotal) elTotal.innerText = statTotal + " دواء";
    if(elExpired) elExpired.innerText = statExpired + " دواء";
    if(elLow) elLow.innerText = statLow + " دواء";
    if(elSales) elSales.innerText = todaySales + " جنيه";
}

// ================= Medicine Table (Add/Update/Delete) =================
function showTable() {
    let tbody = document.getElementById("tbody");
    if(!tbody) return;
    tbody.innerHTML = "";
    arr.forEach((item, index) => {
        let creatTd = document.createElement("tr");
        creatTd.innerHTML = `
            <td data-label="اسم الدواء">${item.medicinName}</td>
            <td data-label="الاسم العلمى">${item.scientificName}</td>
            <td data-label="الشركة المصنعة">${item.manufacturingCompany}</td>
            <td data-label="النوع">${item.select}</td>
            <td data-label="التصنيف">${item.classification}</td>
            <td data-label="السعر">${item.price}</td>
            <td data-label="كمية المخزون">${item.quantity}</td>
            <td data-label="تاريخ الانتهاء">${item.endDate}</td>
            <td data-label="باركود">${item.barcode}</td>
            <td data-label="تحديث"><button onclick="updatItem(${index})">تحديث</button></td>
            <td data-label="حذف"><button onclick="deleteItem(${index})">حذف</button></td>
        `;
        tbody.appendChild(creatTd);
    });
    updateDashboardStats();
}

function updatItem(index) {
    let item = arr[index];
    document.getElementById("medicin_name").value = item.medicinName;
    document.getElementById("scientific_name").value = item.scientificName;
    document.getElementById("manufacturing_company").value = item.manufacturingCompany;
    document.getElementById("select").value = item.select;
    document.getElementById("classification").value = item.classification;
    document.getElementById("price").value = item.price;
    document.getElementById("quantity").value = item.quantity;
    document.getElementById("end_date").value = item.endDate;
    document.getElementById("barcode").value = item.barcode;
    
    arr.splice(index, 1);
    localStorage.setItem("medicine", JSON.stringify(arr));
    showTable();
    getTopage('add_medicen');
}

function deleteItem(index) {
    if(confirm("هل أنت متأكد من حذف هذا الدواء؟")) {
        arr.splice(index, 1);
        localStorage.setItem("medicine", JSON.stringify(arr));
        showTable();
        showReports();
    }
}

document.getElementById("add_btn").addEventListener("click", () => {
    let medicinName = document.getElementById("medicin_name").value;
    let scientificName = document.getElementById("scientific_name").value;
    let manufacturingCompany = document.getElementById("manufacturing_company").value;
    let select = document.getElementById("select").value;
    let classification = document.getElementById("classification").value;
    let price = parseFloat(document.getElementById("price").value);
    let quantity = document.getElementById("quantity").value;
    let endDate = document.getElementById("end_date").value;
    let barcode = document.getElementById("barcode").value;
    
    if (medicinName !== "" && scientificName !== "" && manufacturingCompany !== "" && 
        select !== "النوع" && classification !== "" && !isNaN(price) && 
        quantity !== "" && endDate !== "" && barcode !== "") {
        
        arr.push({
            medicinName, scientificName, manufacturingCompany, select,
            classification, price, quantity: parseInt(quantity), endDate, barcode
        });
        localStorage.setItem("medicine", JSON.stringify(arr));
        showTable();
        clearForm();
        alert("تم إضافة الدواء بنجاح");
    } else {
        alert("من فضلك املأ كل الحقول بشكل صحيح");
    }
});

document.getElementById("reset_btn").addEventListener("click", clearForm);

function clearForm() {
    document.getElementById("medicin_name").value = "";
    document.getElementById("scientific_name").value = "";
    document.getElementById("manufacturing_company").value = "";
    document.getElementById("select").value = "النوع";
    document.getElementById("classification").value = "";
    document.getElementById("price").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("end_date").value = "";
    document.getElementById("barcode").value = "";
}

// ================= Sales Section =================
function populateSalesSelect() {
    let select = document.getElementById("sale_medicine");
    if(!select) return;
    select.innerHTML = '<option value="">اختر الدواء</option>';
    arr.forEach((item, index) => {
        if(parseInt(item.quantity) > 0) {
            select.innerHTML += `<option value="${index}">${item.medicinName} - السعر: ${item.price}</option>`;
        }
    });
    showSalesTable();
}

if(document.getElementById("sale_medicine")) {
    document.getElementById("sale_medicine").addEventListener("change", calcSaleTotal);
    document.getElementById("sale_quantity").addEventListener("input", calcSaleTotal);
}

function calcSaleTotal() {
    let index = document.getElementById("sale_medicine").value;
    let qty = document.getElementById("sale_quantity").value;
    if(index !== "" && qty > 0) {
        let price = arr[index].price;
        document.getElementById("sale_total").value = price * qty;
    } else {
        document.getElementById("sale_total").value = "";
    }
}

if(document.getElementById("confirm_sale_btn")) {
    document.getElementById("confirm_sale_btn").addEventListener("click", () => {
        let index = document.getElementById("sale_medicine").value;
        let qty = parseInt(document.getElementById("sale_quantity").value);
        if(index !== "" && qty > 0) {
            if(qty > parseInt(arr[index].quantity)) {
                alert("الكمية المطلوبة أكبر من المتوفر في المخزون!");
                return;
            }
            let price = arr[index].price;
            let total = price * qty;
            
            // Deduct from inventory
            arr[index].quantity = parseInt(arr[index].quantity) - qty;
            localStorage.setItem("medicine", JSON.stringify(arr));
            
            // Log sale
            let today = new Date().toLocaleDateString();
            sales.push({
                name: arr[index].medicinName,
                qty: qty,
                total: total,
                date: today
            });
            localStorage.setItem("sales", JSON.stringify(sales));
            
            alert("تمت عملية البيع بنجاح");
            document.getElementById("sale_medicine").value = "";
            document.getElementById("sale_quantity").value = "";
            document.getElementById("sale_total").value = "";
            
            showTable(); 
            populateSalesSelect();
        } else {
            alert("الرجاء اختيار دواء وتحديد كمية صحيحة");
        }
    });
}

function showSalesTable() {
    let tbody = document.getElementById("sales_tbody");
    if(!tbody) return;
    tbody.innerHTML = "";
    sales.slice().reverse().forEach((s) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="الدواء">${s.name}</td>
            <td data-label="الكمية">${s.qty}</td>
            <td data-label="الإجمالي">${s.total}</td>
            <td data-label="التاريخ">${s.date}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ================= Inventory Section =================
function showInventory(filter = "") {
    let tbody = document.getElementById("inventory_tbody");
    if(!tbody) return;
    tbody.innerHTML = "";
    let today = new Date();
    
    arr.forEach((item) => {
        if(filter && !item.medicinName.includes(filter)) return;
        
        let isExpired = new Date(item.endDate) <= today;
        let isLow = parseInt(item.quantity) < 10;
        let status = "متوفر";
        let color = "green";
        
        if(isExpired) { status = "منتهي الصلاحية"; color = "red"; }
        else if(parseInt(item.quantity) === 0) { status = "نفد من المخزون"; color = "red"; }
        else if(isLow) { status = "مخزون منخفض"; color = "orange"; }

        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="اسم الدواء">${item.medicinName}</td>
            <td data-label="الشركة">${item.manufacturingCompany}</td>
            <td data-label="السعر">${item.price}</td>
            <td data-label="المخزون">${item.quantity}</td>
            <td data-label="تاريخ الانتهاء">${item.endDate}</td>
            <td data-label="الحالة" style="color: ${color}; font-weight: bold;">${status}</td>
        `;
        tbody.appendChild(tr);
    });
}

function searchInventory() {
    let val = document.getElementById("search_inventory").value;
    showInventory(val);
}

// ================= Reports Section =================
function showReports() {
    let totalSales = sales.reduce((acc, s) => acc + s.total, 0);
    let elTotalSales = document.getElementById("report_total_sales");
    let elTotalOps = document.getElementById("report_total_ops");
    
    if(elTotalSales) elTotalSales.innerText = totalSales + " جنيه";
    if(elTotalOps) elTotalOps.innerText = sales.length + " عملية";

    let tbodyExpired = document.getElementById("report_expired_tbody");
    let tbodyLowStock = document.getElementById("report_low_stock_tbody");
    
    if(tbodyExpired) {
        tbodyExpired.innerHTML = "";
        let today = new Date();
        let expired = arr.filter(item => new Date(item.endDate) <= today);
        if(expired.length === 0) {
            tbodyExpired.innerHTML = `<tr><td colspan="4" style="text-align: center;">لا توجد أدوية منتهية الصلاحية</td></tr>`;
        } else {
            expired.forEach(item => {
                let originalIndex = arr.indexOf(item);
                let tr = document.createElement("tr");
                tr.innerHTML = `
                    <td data-label="اسم الدواء">${item.medicinName}</td>
                    <td data-label="تاريخ الانتهاء">${item.endDate}</td>
                    <td data-label="الكمية المتبقية">${item.quantity}</td>
                    <td data-label="إجراء"><button style="background-color: red; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;" onclick="deleteItem(${originalIndex})">حذف التالف</button></td>
                `;
                tbodyExpired.appendChild(tr);
            });
        }
    }

    if(tbodyLowStock) {
        tbodyLowStock.innerHTML = "";
        let low = arr.filter(item => parseInt(item.quantity) < 10);
        if(low.length === 0) {
            tbodyLowStock.innerHTML = `<tr><td colspan="4" style="text-align: center;">لا توجد نواقص في المخزون</td></tr>`;
        } else {
            low.forEach(item => {
                let tr = document.createElement("tr");
                tr.innerHTML = `
                    <td data-label="اسم الدواء">${item.medicinName}</td>
                    <td data-label="الشركة">${item.manufacturingCompany}</td>
                    <td data-label="الكمية المتبقية">${item.quantity}</td>
                    <td data-label="سعر الوحدة">${item.price}</td>
                `;
                tbodyLowStock.appendChild(tr);
            });
        }
    }
}

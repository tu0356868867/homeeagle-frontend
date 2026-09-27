document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    
    const homeId = params.get("homeId");

     if (homeId) {
        updateHome(homeId)
    } else {
        createHome();
    }
})

async function createHome(){
    const form = document.getElementById("rentForm");
    const postBtn = document.getElementById("postBtn");
    const message = document.getElementById("message");

    let isPosting = false;
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
    

    if (isPosting) {
        return;
    }

    const address = document.getElementById("Address").value.trim();
    const price = parsePrice(document.getElementById("Price").value);
    const type = document.getElementById("roomType").value;
    const quantity = document.getElementById("Quantity").value;
    const area = document.getElementById("Number").value;
    const contact = normalizeVietnamPhone(document.getElementById("Contact").value.trim());
    const picture = document.getElementById("Picture").value.trim();
    const description = document.getElementById("Description").value.trim();
    
    if (!address) {
        showMessage("Địa chỉ không được để trống.");
        return;
    }

    if (!type) {
        showMessage("Vui lòng chọn loại phòng.");
        return;
    }

    if (!area) {
        showMessage("Area không được để trống.");
        return;
    }  else if (!/^\d+$/.test(area)) {
            showMessage("Diện tích phải là số nguyên")
    }

    if (!quantity) {
        showMessage("Số phòng không được để trống.");
        return;
    }if (!/^\d+$/.test(quantity)) {
        showMessage("Số phòng phải là số nguyên")
    }

    if (!contact) {
        showMessage("Liên hệ không được để trống.");
        return;
    }

    if (!picture) {
        showMessage("Picture không được để trống.");
        return;
    }

    if (picture.length > 2048) {
    alert("Link ảnh quá dài");
    }

    if (description.length > 200) {
    alert("Mô tả không được vượt quá 200 ký tự");
    }

    if (Number(price) <= 0) {
        showMessage("Price phải lớn hơn 0.");
        return;
    }


    if (Number(area) <= 0) {
        showMessage("Area phải lớn hơn 0.");
        return;
    }

    const phoneRegex = /^0[0-9]{9}$/;

    if (!phoneRegex.test(contact)) {
    document.getElementById("message").innerText =
        "Số điện thoại không hợp lệ";
    return;
    }

    try {
        new URL(picture);
    } catch (error) {
        showMessage("Link ảnh không hợp lệ.");
        return;
    }

    const requestBody = {
        address: address,
        price: Number(price),
        type: type,
        area: Number(area),
        quantity: Number(quantity),
        contact: contact,
        picture: picture,
        describe: description
    };

    isPosting = true;

    // Disable button
    postBtn.disabled = true;
    postBtn.innerText = "Đang lưu...";

    const csrfToken = getCookie("XSRF-TOKEN");
    try {
        const response = await fetch("http://192.168.42.70:8080/homes", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": csrfToken
            },
            credentials: "include",

            body: JSON.stringify(requestBody)
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {

            
            if (response.status === 401) {
                alert("Bạn chưa đăng nhập!");
                window.location.href = "../login.html";
                return;
            }

            if (response.status === 403) {
                alert("Bạn không được truy cập tài nguyên này!");
                return;
            }

            showMessage(
                data?.message ||
                "Đăng bài thất bại."
            );

            return;
        }
        showMessage(
            data?.message ||
            "Đăng bài thành công."
        );


        // Xóa form
        form.reset();


    } catch (error) {

        console.error("POST ERROR:", error);

        showMessage(
            "Không thể kết nối tới server."
        );

    } finally {
        // Cho phép POST lại sau khi request kết thúc
        isPosting = false;

        postBtn.disabled = false;
        postBtn.innerText = "Post Rental";
    }
    });
}

async function updateHome(homeId){
    await loadHome(homeId);
    const form = document.getElementById("rentForm");
    const postBtn = document.getElementById("postBtn");
    const message = document.getElementById("message");

    let isPosting = false;
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
    

    if (isPosting) {
        return;
    }

    const address = document.getElementById("Address").value.trim();
    const price = document.getElementById("Price").value;
    const type = document.getElementById("roomType").value;
    const quantity = document.getElementById("Quantity").value;
    const area = document.getElementById("Number").value;
    const contact = normalizeVietnamPhone(document.getElementById("Contact").value.trim());
    const picture = document.getElementById("Picture").value.trim();
    const description = document.getElementById("Description").value.trim();
    
    if (!address) {
        showMessage("Địa chỉ không được để trống.");
        return;
    }

    if (!type) {
        showMessage("Vui lòng chọn loại phòng.");
        return;
    }

    if (!area) {
        showMessage("Area không được để trống.");
        return;
    }  else if (!/^\d+$/.test(area)) {
            showMessage("Diện tích phải là số nguyên")
    }

    if (!quantity) {
        showMessage("Số phòng không được để trống.");
        return;
    }if (!/^\d+$/.test(quantity)) {
        showMessage("Số phòng phải là số nguyên")
    }

    if (!contact) {
        showMessage("Liên hệ không được để trống.");
        return;
    }

    if (!picture) {
        showMessage("Picture không được để trống.");
        return;
    }

    if (Number(price) <= 0) {
        showMessage("Price phải lớn hơn 0.");
        return;
    }


    if (Number(area) <= 0) {
        showMessage("Area phải lớn hơn 0.");
        return;
    }

    const phoneRegex = /^0[0-9]{9}$/;

    if (!phoneRegex.test(contact)) {
    document.getElementById("message").innerText =
        "Số điện thoại không hợp lệ";
    return;
    }

    try {
        new URL(picture);
    } catch (error) {
        showMessage("Link ảnh không hợp lệ.");
        return;
    }

    const requestBody = {
        address: address,
        price: parsePrice(price),
        type: type,
        area: Number(area),
        quantity: Number(quantity),
        contact: contact,
        picture: picture,
        describe: description
    };

    isPosting = true;

    // Disable button
    postBtn.disabled = true;
    postBtn.innerText = "Đang lưu...";

    try {
        const csrfToken = getCookie("XSRF-TOKEN");
        const response = await fetch(`http://192.168.42.70:8080/homes/${homeId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": csrfToken
            },
            credentials: "include",
            body: JSON.stringify(requestBody)
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {

            if (response.status === 401) {
                alert("Bạn chưa đăng nhập!");
                window.location.href = "../login.html";
                return;
            }

            if (response.status === 403) {
                alert("Bạn không được truy cập tài nguyên này!");
                return;
            }

            showMessage(
                data?.message ||
                "Sửa bài thất bại."
            );

            return;
        }
        showMessage(
            data?.message ||
            "Sửa bài thành công."
        );


        // Xóa form
        form.reset();


    } catch (error) {

        console.error("POST ERROR:", error);

        showMessage(
            "Không thể kết nối tới server."
        );

    } finally {
        // Cho phép POST lại sau khi request kết thúc
        isPosting = false;

        postBtn.disabled = false;
        postBtn.innerText = "Post Rental";
    }
    });
}

async function loadHome(homeId) {
    
    try {
        const response = await fetch(
            `http://192.168.42.70:8080/homes/${homeId}`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

        console.log("JSON từ backend:", data);

        const home = data.result;

        document.getElementById("Address").value =
            home.address || "";

        document.getElementById("Price").value =
            home.price || "";

        document.getElementById("roomType").value =
            home.type || "";

        document.getElementById("Number").value =
            home.area || "";

        document.getElementById("Quantity").value =
            home.quantity || "";

        document.getElementById("Contact").value =
            home.contact || "";

        document.getElementById("Picture").value =
            home.picture || "";

        document.getElementById("Description").value =
            home.describe || "";

    } catch (error) {

        console.error("Không thể lấy dữ liệu:", error);

    }
}


function normalizeVietnamPhone(phone) {
    if (phone == null || phone.trim() === "") {
        return null;
    }

    // Xóa khoảng trắng, ., -, (, )
    let value = phone.replace(/[\s.()\-]/g, "");

    // +84912345678 -> 0912345678
    if (value.startsWith("+84")) {
        value = "0" + value.substring(3);
    }

    // 84912345678 -> 0912345678
    else if (value.startsWith("84") && value.length === 11) {
        value = "0" + value.substring(2);
    }

    return value;
}

function parsePrice(input) {
    if (input == null || input.trim() === "") {
        throw new Error("Giá không được để trống");
    }
    let value = input
        .trim()
        .toLowerCase()
        .replace("vnd", "")
        .replace("vnđ", "")
        .replace("đ", "")
        .trim();

    // 5tr, 5tr5, 5.5tr
    if (value.endsWith("tr")) {
        let number = value
            .substring(0, value.length - 2)
            .trim()
            .replace(",", ".");

        let million = Number(number);

        if (!Number.isFinite(million)) {
            throw new Error("Giá không hợp lệ");
        }

        let price = million * 1_000_000;

        if (!Number.isSafeInteger(price)) {
            throw new Error("Giá quá lớn");
        }

        return price.toString();
    }

    // 5m, 5.5m
    if (value.endsWith("m")) {
        let number = value
            .substring(0, value.length - 1)
            .trim()
            .replace(",", ".");

        let million = Number(number);

        if (!Number.isFinite(million)) {
            throw new Error("Giá không hợp lệ");
        }

        let price = million * 1_000_000;

        if (!Number.isSafeInteger(price)) {
            throw new Error("Giá quá lớn");
        }

        return price.toString();
    }

    // Giá dạng số:
    // 5000000
    // 5.000.000
    // 5,000,000
    value = value
        .replace(/\./g, "")
        .replace(/,/g, "")
        .replace(/\s/g, "");

    // Chỉ cho phép số nguyên dương
    if (!/^\d+$/.test(value)) {
        throw new Error("Giá không hợp lệ");
    }

    let price = Number(value);

    if (!Number.isSafeInteger(price)) {
        throw new Error("Giá quá lớn");
    }

    return price.toString();
}

function showMessage(text) {
    message.innerText = text;
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Kiểm tra tên cookie có khớp không
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}




    

    



    

    


    

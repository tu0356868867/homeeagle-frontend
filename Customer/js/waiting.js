let listhome = null;

async function create(){
        const address = document.getElementById("Address").value;
        const max_roomate = document.getElementById("Max_Roomate").value;
        const price = parsePrice(document.getElementById("Price").value);
        const type = document.getElementById("RoomType").value;
        const area = document.getElementById("Number").value;
        const contact = normalizeVietnamPhone(document.getElementById("Contact").value);
        const picture = document.getElementById("Picture").value;
        const description = document.getElementById("Description").value;
        
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

        if (!contact) {
        showMessage("Liên hệ không được để trống.");
        return;
        }

        if (!picture) {
        showMessage("Picture không được để trống.");
        return;
        }

        if (description.length > 2048) {
        alert("Link ảnh quá dài");
        }

        if (Number(price) <= 0) {
        showMessage("Price phải lớn hơn 0.");
        return;
    }


    if (Number(area) <= 0) {
        showMessage("Area phải lớn hơn 0.");
        return;
    }

    if (description.length > 200) {
    alert("Mô tả không được vượt quá 200 ký tự");
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
            max_roomate: max_roomate,
            price: price,
            type: type,
            area: area,
            contact: contact,
            picture: picture,
            infor: description
        };
        localStorage.setItem("homes", JSON.stringify(requestBody));

        if(!listhome){
        const csrfToken = getCookie("XSRF-TOKEN");
        try {
            const response = await fetch(
                "http://192.168.42.70:8080/roomate",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "X-XSRF-TOKEN": csrfToken
                    },
                    
                    body: JSON.stringify(requestBody)
                }
            );

            if(!response.ok){
                 if (response.status === 401) {
                alert("Bạn chưa đăng nhập!");
                window.location.href = "../login.html";
                return;
                 }

                if (response.status === 403) {
                alert("Bạn không được truy cập tài nguyên này!");
                return;
                }

                alert("Có lỗi!")
            }

            const data = await response.json();
            localStorage.setItem("id", JSON.stringify(data.result));
            id = data.result;
            if (response.ok) {
                alert("Đã lưu!");
            }

        }catch (error) {

            document.getElementById("message")
                .innerText = "Không thể kết nối server";

            console.error(error);
        }}else{
            const  result = JSON.parse(localStorage.getItem("id"));
            const id = result.id;
        if(!id){
            alert("Vui lòng thêm phòng mới");
        }else{
            const csrfToken = getCookie("XSRF-TOKEN");
            try {
            const response = await fetch(
                `http://192.168.42.70:8080/roomate/${id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "X-XSRF-TOKEN": csrfToken
                    },
                    body: JSON.stringify(requestBody)
                }
            );

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
                alert("Cập nhật không thành công!")
            }
            if (response.ok) {
                console.log("Update thành công");
            }
            

            }catch (error) {

            console.error(error);
            } 
    }
            

        }
        
}

async function deleteRoom(){
    const  result = JSON.parse(localStorage.getItem("id"));
    const id = result.id;
    if(!id){
        alert("Chưa tồn tại phòng để xóa")
    }else{
    try{
    const response = await fetch(
        `http://192.168.42.70:8080/roomate/${id}`,
            {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                }
            );

             if(!response.ok){
                 if (response.status === 401) {
                alert("Bạn chưa đăng nhập!");
                window.location.href = "../login.html";
                return;
                 }

                if (response.status === 403) {
                alert("Bạn không được truy cập tài nguyên này!");
                return;
                }

                alert("Có lỗi!");
            }


            if (response.ok) {
                alert("Xóa thành công!");
            }
            
    localStorage.removeItem("id");
    localStorage.removeItem("homes");
    } catch (error){
        console.error(error);
    }
}

}

async function editRoom(){
    const  listhome = JSON.parse(localStorage.getItem("homes")) || [];
    
    if (listhome.length === 0) {
        alert("Vui lòng tạo phòng mới!")
    }else{
    document.getElementById("Address").value =
        listhome.address;

    document.getElementById("Max_Roomate").value =
        listhome.max_roomate;

    document.getElementById("Price").value =
        listhome.price;

    document.getElementById("RoomType").value =
        listhome.type;

    document.getElementById("Number").value =
        listhome.area;

    document.getElementById("Contact").value =
        listhome.contact;

    document.getElementById("Picture").value =
        listhome.picture;

    document.getElementById("Description").value =
        listhome.infor;
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

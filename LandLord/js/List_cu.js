document.addEventListener("DOMContentLoaded", function () {

    loadMyAppointment();

});


async function loadMyAppointment() {

    try {

        const response = await fetch(
            "http://192.168.42.70:8080/appointments/landlord",
            {
                method: "GET",
                credentials: "include",
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

            throw new Error("Không thể lấy danh khách hàng");

        }

        const data = await response.json();

        console.log("API:", data);

        const renter = data.result || [];

        renderRooms(renter);

    } catch (error) {

        console.error("Lỗi:", error);

        document.getElementById("roomTableBody").innerHTML = `
            <tr>
                <td colspan="6">
                    Không thể tải danh sách phòng
                </td>
            </tr>
        `;

    }

}


function renderRooms(renter) {

    const tbody = document.getElementById("roomTableBody");

    tbody.innerHTML = "";

    if (renter.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    Bạn chưa có khách nào
                </td>
            </tr>
        `;

        return;
    }
     let total = 0;
    renter.forEach((ren, index) => {
        total++; 

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>

            <td>${escapeHtml(ren.fullname)}</td>

            <td>${escapeHtml(ren.type)}</td>

            <td>${escapeHtml(ren.appointmentDate)}</td>

            <td>${escapeHtml(ren.address)}</td>


            <td>
            
                <select 
                    id="status"
                    onchange="updateStatus(value,'${ren.id}')"
                    class="action-select"
                    >

                    <option value=""
                     ${ren.status === "PENDING" ? "selected" : ""}
                    >Thao tác</option>

                    <option value="CONFIRMED"
                    ${ren.status === "CONFIRMED" ? "selected" : ""}
                    >
                        Xác nhận
                    </option>

                    <option value="CANCELLED"
                    ${ren.status === "CANCELLED" ? "selected" : ""}
                    >
                        Hủy
                    </option>

                </select>
            </td>
        `;
        document.getElementById("totalCustomer").innerText = total;

        tbody.appendChild(row);

    });

}

async function updateStatus(status,id){
      const requestBody = {
        status: status
      }
    try{
    console.log(1);
    
     const csrfToken = getCookie("XSRF-TOKEN");
     const response = await fetch(`http://192.168.42.70:8080/appointments/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": csrfToken
            },

            credentials: "include",

            body: JSON.stringify(requestBody)
        });
        const data = await response.json()


        if(response.ok){
            alert(data.message)
        }
    } catch(error){
        console.error("Lỗi:", error);
    }
}
function escapeHtml(value) {
    if (value == null) return "";

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function handleAction(select,homeId) {
    const action = select.value;

    if (!action) {
        return;
    }

    if (action === "view") {

        window.location.href = `Add.html?homeId=${homeId}`;

    }

    if (action === "delete") {

        deleteRoom(homeId);

    }

    // Reset select
    select.value = "";
}


async function deleteRoom(homeId) {

    const confirmDelete =
        confirm("Bạn có chắc muốn xóa phòng này không?");

    if (!confirmDelete) {
        return;
    }
    const csrfToken = getCookie("XSRF-TOKEN");
    try {

        const response = await fetch(
            `http://192.168.42.70:8080/homes/${homeId}`,
            {
                method: "DELETE",
                credentials: "include",
                headers: {
                        "X-XSRF-TOKEN": csrfToken
                }
            }
        );

        if (!response.ok) {

            throw new Error("Xóa phòng thất bại");

        }

        alert("Xóa phòng thành công");

        // Load lại danh sách
        loadMyRooms();

    } catch (error) {

        console.error(error);

        alert("Không thể xóa phòng");

    }

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
document.addEventListener("DOMContentLoaded", function () {

    loadMyRooms();

});


async function loadMyRooms() {
    try {
        const response = await fetch(
            "http://192.168.42.70:8080/homes/manager",
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

            throw new Error("Không thể lấy danh sách phòng");

        }

        const data = await response.json();

        console.log("API:", data);

        const rooms = data.result || [];

        renderRooms(rooms);
        updateStatistics(rooms);

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

function renderRooms(rooms) {

    const tbody = document.getElementById("roomTableBody");

    tbody.innerHTML = "";

    if (rooms.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    Bạn chưa có phòng nào
                </td>
            </tr>
        `;

        return;
    }

    rooms.forEach((room, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>

            <td>${escapeHtml(room.address)}</td>

            <td>${room.quantity ?? 0}</td>

            <td>${escapeHtml(room.type)}</td>

            <td>${formatPrice(room.price)}</td>


            <td>
            
                <select 
                    
                    class="action-select"
                    onchange = "handleAction(this,'${room.idHome}')">

                    <option value="">Thao tác</option>

                    <option value="view">
                        👁 Xem
                    </option>

                    <option value="delete">
                        🗑 Xóa
                    </option>

                </select>
            </td>
        `;

        tbody.appendChild(row);

    });

}

function formatPrice(price) {

    if (price == null) {
        return "0đ";
    }

    return Number(price).toLocaleString("vi-VN") + "đ";

}

function updateStatistics(rooms) {

    // Tổng số phòng
    const total = rooms.reduce(
        (sum, room) => sum + Number(room.quantity || 0),
        0
    );

    // Doanh thu dự kiến
    const projectedRevenue = rooms.reduce(
        (sum, room) =>
            sum +
            Number(room.quantity || 0) *
            Number(room.price || 0),
        0
    );

    document.getElementById("totalRooms").innerText = total;

    document.getElementById("projectedRevenue").innerText =
        formatPrice(projectedRevenue);
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
    console.log("Code đã chạy!");
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

    try {
        const csrfToken = getCookie("XSRF-TOKEN");
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

            if (response.status === 401) {
                alert("Bạn chưa đăng nhập!");
                window.location.href = "../login.html";
                return;
            }

            if (response.status === 403) {
                alert("Bạn không được truy cập tài nguyên này!");
                return;
            }

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
async function loadApartments() {
    try {
        const response = await fetch(
            "http://192.168.42.70:8080/homes",
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
            console.log("HTTP Error:", response.status);
            return;
        }

        const data = await response.json();

        console.log("API DATA:", data);

        const apartments = data.result;

        const postList = document.getElementById("postList");

        if (!postList) {
            console.error("Không tìm thấy #postList");
            return;
        }

        postList.innerHTML = "";

        apartments.forEach(apartment => {

            postList.innerHTML += `
                <div class="card">

                    <a href="${apartment.picture}" target="_blank">
                        <h3>${apartment.address}</h3>
                    </a>

                    <p>
                        Loại: ${apartment.type}
                    </p>

                    <p>
                        Mô tả: ${apartment.describe}
                    </p>

                    <p class="price">
                        ${apartment.price
                            ? apartment.price.toLocaleString()
                            : 0}
                        VND
                    </p>

                    <button
                        type="button"
                        class="detail-btn"
                        onclick="openBookingPopup('${apartment.id}')">
                        Đặt lịch
                    </button>

                </div>
            `;
        });

    } catch (error) {
        console.error("Load apartments error:", error);
    }
}

loadApartments().then(data => {
  document.getElementById("result");
});

async function filterhome(){
       const params = new URLSearchParams();

        const address = document.getElementById("address").value.trim();
        if (address  ) params.append("address", address);

        const type = document.getElementById("type").value;
        if (type && type !== "Tất cả") params.append("type", type);

       const filter = document.getElementById("price-filter").value;
       if(filter === "under-4m"){
         params.append("maxprice", 4000000);
       }
        else if (filter === "over-7m"){
         params.append("minprice", 7000000);
        }else  if (filter === "4-7m"){
        params.append("minprice", 4000000);
        params.append("maxprice", 7000000);
        }

        console.log(params);
        console.log(params.toString());

        renderRooms(params);
}

async function renderRooms(params){
     try {
        const response = await fetch(
            `http://192.168.42.70:8080/homes/filterhome?${params}`,
            {
                method: "GET",
                credentials: "include",
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
        result = data.result.content
        const postList = document.getElementById("postList");
        postList.innerHTML = "";

        result.forEach(result => {

            postList.innerHTML += `
                <div class="card">

                    <a href="${result.picture}" target="_blank">
                        <h3>${result.address}</h3>
                    </a>

                    <p>
                        Loại: ${result.type}
                    </p>

                    <p>
                        Mô tả: ${result.describe}
                    </p>

                    <p class="price">
                        ${result.price
                            ? result.price.toLocaleString()
                            : 0}
                        VND
                    </p>

                    <button
                        type="button"
                        class="detail-btn"
                        onclick="openBookingPopup('${result.id}')">
                        Đặt lịch
                    </button>

                </div>
            `;
        });

    }catch (error) {
        console.error("Load apartments error:", error);
    }
}
const searchBtn = document.getElementById("searchBtn");

let selectedHomeId = null;

function openBookingPopup(homeid) {
    selectedHomeId = homeid;
    document.getElementById("bookingPopup").classList.add("show");
}


function closeBookingPopup() {
    document.getElementById("bookingPopup").classList.remove("show");
    selectedHomeId = null;
}


function openAppointmentPopup() {
    getAppointment()
    
}

function closeAppointmentPopup() {
    document.getElementById("appointmentOverlay").classList.remove("show");
    selectedHomeId = null;

}


async function getAppointment() {

    const date = document.getElementById("bookingDate").value;
    // Kiểm tra đã chọn đủ chưa
    if (!date) {
        alert("Vui lòng chọn ngày.");
        return;
    }else{
    const requestBody ={
        appointmentDate:date
    }
    const csrfToken = getCookie("XSRF-TOKEN");
    try {

        const response = await fetch(`http://192.168.42.70:8080/appointments/${selectedHomeId}`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": csrfToken
            },

            credentials: "include",

            body: JSON.stringify(requestBody)
        });


        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Có lỗi xảy ra");
        }

        showAppointmentPopup(data);

    } catch (error) {

        console.error(error);
        alert(error.message);

    }
    document.getElementById("appointmentOverlay").classList.add("show");
    document.getElementById("bookingDate").value = ""
    }
}


function showAppointmentPopup(data) {

    const result = data.result;

    document.getElementById("appointmentType").textContent =
        result.type || "---";

    document.getElementById("appointmentContact").textContent =
        result.contact || "---";

    document.getElementById("appointmentAddress").textContent =
        result.address || "---";

    document.getElementById("appointmentDate").textContent =
        formatDate(result.appointmentDate);

    document.getElementById("appointmentOverlay")
        .classList.add("show");
}

function formatDate(date) {

    if (!date) {
        return "---";
    }

    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
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
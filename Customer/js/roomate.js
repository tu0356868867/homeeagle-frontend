async function loadApartments() {
    try {
        const response = await fetch(
            "http://192.168.42.70:8080/roomate",
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

            alert("Có lỗi!");
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
                        Mô tả: ${apartment.infor}
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
                        onclick="getAppointment('${apartment.id}')">
                        Chi tiết
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
            `http://192.168.42.70:8080/roomate/search?${params}`,
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
            
            alert("Có lỗi");
            return;
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
                        Mô tả: ${result.infor}
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
                        onclick="getAppointment('${result.id}')">
                        Chi tiết
                    </button>

                </div>
            `;
        });

    }catch (error) {
        console.error("Load apartments error:", error);
    }
}
const searchBtn = document.getElementById("searchBtn");



function closeAppointmentPopup() {
    document.getElementById("appointmentOverlay").classList.remove("show");
}

async function getAppointment(id) {
    try {
        const response = await fetch(`http://192.168.42.70:8080/roomate/detail/${id}`, {
            method: "GET",
            credentials: "include"
        });

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

            alert("Có lỗi!");
            return;
        }


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



function showAppointmentPopup(data) {

    const result = data.result;

    document.getElementById("appointmentType").textContent =
        result.type || "---";

    document.getElementById("appointmentContact").textContent =
        result.contact || "---";

    document.getElementById("appointmentAddress").textContent =
        result.address || "---";

    document.getElementById("appointmentDate").textContent =
       result.max_roomate

    document.getElementById("appointmentOverlay")
        .classList.add("show");
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
document.addEventListener("DOMContentLoaded", () => {

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

});


async function logout() {
    const csrfToken = getCookie("XSRF-TOKEN");
    try {
        const response = await fetch(
            "http://192.168.42.70:8080/auth/logout",
            {
                method: "POST",
                credentials: "include",
                headers: {
                "X-XSRF-TOKEN": csrfToken
            }
            }
        );

        if (!response.ok) {
            console.error("Logout failed:", response.status);
            return;
        }

        // Xóa dữ liệu frontend nếu có
        sessionStorage.clear();

        // Chuyển về trang đăng nhập
        window.location.href = "../login.html";

    } catch (error) {

        console.error("Logout error:", error);

    }
}



        // =========================
        // MỞ POPUP
        // =========================

        function openProfilePopup() {

            const popup =
                document.getElementById("profileOverlay");

            popup.classList.add("show");
        }


        // =========================
        // ĐÓNG POPUP
        // =========================

        function closeProfilePopup() {

            const popup =
                document.getElementById("profileOverlay");

            popup.classList.remove("show");
        }


        // =========================
        // SAVE
        // =========================

        function saveProfile() {

            const Username =
                document.getElementById("Username").value.trim();

            const password =
                document.getElementById("password").value.trim();

            if (!username) {
            alert("Vui lòng nhập username");
            return;
            }

            if (!password) {
            alert("Vui lòng nhập password");
            return;
            }

            const csrfToken = getCookie("XSRF-TOKEN");
            const response = fetch("/users/update", {
                 method: "PATCH",
                 headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": csrfToken
                },
                 body: JSON.stringify({
                     username: Username,
                     password: password
                })
             });

             const data = response.json();

            alert(data.message)

            closeProfilePopup();
        }

        // =========================
        // CLICK RA NGOÀI POPUP
        // ĐỂ ĐÓNG
        // =========================

        document
            .getElementById("profileOverlay")
            .addEventListener("click", function(event) {

                if (event.target === this) {
                    closeProfilePopup();
                }

            });


        // =========================
        // ESC ĐỂ ĐÓNG
        // =========================

        document.addEventListener("keydown", function(event) {

            if (event.key === "Escape") {
                closeProfilePopup();
            }

        });

const moreBtn = document.getElementById("moreBtn");
const popup = document.getElementById("popup");

const historyBtn = document.getElementById("historyBtn");
const historyPopup = document.getElementById("history");


// ========================
// MỞ / ĐÓNG POPUP 3 CHẤM
// ========================

moreBtn.addEventListener("click", function (event) {

    event.stopPropagation();

    popup.classList.toggle("show");

});


// ========================
// MỞ HISTORY
// ========================

historyBtn.addEventListener("click", function (event) {

    event.stopPropagation();

    historyPopup.classList.add("show");

    myAppointment()

});


// ========================
// CLICK TRONG POPUP 3 CHẤM
// ========================

popup.addEventListener("click", function (event) {

    event.stopPropagation();

});


// ========================
// CLICK TRONG HISTORY
// ========================

historyPopup.addEventListener("click", function (event) {

    event.stopPropagation();

});


// ========================
// CLICK RA NGOÀI
// ========================

document.addEventListener("click", function () {

   if (historyPopup.classList.contains("show")) {

        historyPopup.classList.remove("show");

    } else if (popup.classList.contains("show")) {

        popup.classList.remove("show");

    }
});

async function myAppointment(){
    try {
        const response = await fetch(
            `http://192.168.42.70:8080/appointments`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        if (!response.ok) {
            console.log("HTTP Error:", response.status);
            return;
        }
        
        const data = await response.json();

        appointment = data.result;

        groups = renderHistory(appointment);

        const historyContent = document.getElementById("historyContent");

        let html = "";

    for (const group in groups) {
        html += `
        <div class="date-title">
            ${group}
        </div>
            `;

        groups[group].forEach(item => {

        html += `
            <div class="history-item">
                
                <div class="history-name"
                 onclick="getrenterAppointment('${item.idAppointment}')"
                   >
                    ${item.address}
                </div>

                <div class="history-time">
                    ${item.status}
                </div>

                <button
                    class="delete-history"
                    onclick="deleteAppointment('${item.idAppointment}')"
                    title="Delete">
                    <i data-lucide="x"></i>
                </button>
            </div>
        `;
        });
        const historyContent = document.querySelector(".history-content");
        historyContent.innerHTML = html;
         lucide.createIcons();
        }
    }catch (error) {
        console.error("Lỗi mạng.");
}

}
async function deleteAppointment(idAppointment) {

const csrfToken = getCookie("XSRF-TOKEN");
try {
        const response = await fetch(
            `http://192.168.42.70:8080/appointments/${idAppointment}`,
            {
                method: "DELETE",
                credentials: "include",
                headers: {
                "X-XSRF-TOKEN": csrfToken
            }
            }
        );

        if (!response.ok) {

            throw new Error("Xóa thất bại");

        }

        alert("Xóa thành công");

        // Load lại danh sách
        myAppointment();

    } catch (error) {

        console.error(error);

        alert("Không thể xóa");

    }

}
        

    // In tên nhóm
    

        // In các item trong nhó
        
 //   } catch (error) {

  //      console.error("Lỗi mạng.");
//}


function getDateGroup(date) {

        const now = new Date();

        const today =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );

        const target =
            new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );


        const diff =
            Math.floor(
                (today - target) /
                (1000 * 60 * 60 * 24)
            );


        if (diff === 0) {

            return "Today";

        }

        if (diff === 1) {

            return "Yesterday";

        }


        return date.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    }

function renderHistory(data)
 {

        const groups = {};

        data.sort(
            (a, b) =>
            parseDateOnly(a.createdAt) -
            parseDateOnly(b.createdAt)
            );


        data.forEach(item => {

            const group =
                getDateGroup(
                    parseDateOnly(item.createdAt)
                );

            if (!groups[group]) {

                groups[group] = [];

            }

            groups[group].push(item);

        });

        return groups; 

}

function parseDateOnly(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);

    return new Date(year, month - 1, day);
}

function openAppointmentPopup() {
    getAppointment()
    
}

function closeAppointmentPopup() {
    document.getElementById("appointmentOverlay").classList.remove("show");
    selectedHomeId = null;

}

async function getrenterAppointment(idAppointment) {
    const csrfToken = getCookie("XSRF-TOKEN");
    try {
        const response = await fetch(`http://192.168.42.70:8080/appointments/renter/${idAppointment}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": csrfToken
            },
            credentials: "include",
        });


        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Có lỗi xảy ra");
        }

        showPopup(data);

    } catch (error) {

        console.error(error);
        alert(error.message);

    }
    document.getElementById("appointmentOverlay").classList.add("show");
    document.getElementById("bookingDate").value = ""
    }
function showPopup(data) {

    const result = data.result;

    document.getElementById("appointmentType").textContent =
        result.type || "---";

    document.getElementById("appointmentContact").textContent =
        result.contact || "---";

    document.getElementById("appointmentAddress").textContent =
        result.address || "---";

    document.getElementById("appointmentDate").textContent =
        formatDate(result.createdAt);

    document.getElementById("appointmentOverlay")
        .classList.add("show");
}


//Feedback popup

function openFeedbackPopup() {
            const popup =
                document.getElementById("FeedbackOverlay");

            popup.classList.add("show");
        }

function closeFeedbackPopup() {

            const popup =
                document.getElementById("FeedbackOverlay");

            popup.classList.remove("show");
        }

async function saveFeedBack(){
    const detail = document.getElementById("content" ).value.trim();
    if(!detail){
        alert("Vui lòng nhập thông tin!")
    }
    requestBody = {
        feedback: detail
    }
    const csrfToken = getCookie("XSRF-TOKEN");
    try{
     const response = await fetch(
                "http://192.168.42.70:8080/users/feedback",
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
    
    if(response.ok){
        const data = await response.json();
        alert(data.message)
    }
    }catch(error){
        alert("Lỗi mạng!")
    }
}
    
document.getElementById("FeedbackOverlay")
            .addEventListener("click", function(event) {

                if (event.target === this) {
                    closeFeedbackPopup();
                }

            });


        // =========================
        // ESC ĐỂ ĐÓNG
        // =========================

document.addEventListener("keydown", function(event) {

            if (event.key === "Escape") {
                 closeFeedbackPopup();
            }

        });

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
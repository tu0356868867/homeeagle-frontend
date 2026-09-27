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
                },
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




const moreBtn = document.getElementById("moreBtn");
const popup = document.getElementById("popup");

// ========================
// MỞ / ĐÓNG POPUP 3 CHẤM
// ========================

moreBtn.addEventListener("click", function (event) {

    event.stopPropagation();

    popup.classList.toggle("show");

});



// ========================
// CLICK TRONG POPUP 3 CHẤM
// ========================

popup.addEventListener("click", function (event) {

    event.stopPropagation();

});




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

//Feedback popup

function openFeedbackPopup() {
            const popup =
                document.getElementById("FeedbackOverlay");

            popup.classList.add("show");
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
function closeFeedbackPopup() {

            const popup =
                document.getElementById("FeedbackOverlay");

            popup.classList.remove("show");
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
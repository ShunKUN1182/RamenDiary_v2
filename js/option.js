const logoutBtn = document.querySelector("#logoutBtn");
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loginUser");
    window.location.href = "./login.html";
});

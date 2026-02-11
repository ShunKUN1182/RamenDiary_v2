import { supabase } from "./supabase.js";

const databaseName = "user_data";
const userName = document.querySelector("#userName");
const userID = document.querySelector("#userID");
const userPass = document.querySelector("#userPass");
const submitBtn = document.querySelector("#submitBtn");

submitBtn.addEventListener("click", async () => {
    if (!userID.value || !userPass.value || !userName.value) {
        alert("全ての項目を入力してください");
        return;
    }
    const { data, error } = await supabase.from(databaseName).insert([
        {
            userID: userID.value,
            password: userPass.value,
            name: userName.value,
        },
    ]);
    if (error) {
        console.log(error);
        alert("error");
    } else {
        alert("アカウントが登録されました！");
        window.location.href = "./login.html";
    }
});

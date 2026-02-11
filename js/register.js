import { supabase } from "./supabase.js";

const databaseName = "user_data";
const userName = document.querySelector("#userName");
const userID = document.querySelector("#userID");
const userPass = document.querySelector("#userPass");
const submitBtn = document.querySelector("#submitBtn");

submitBtn.addEventListener("click", async () => {
    await supabase.from(databaseName).insert({
        id: userID.value,
        password: userPass.value,
        name: userName.value,
    });
    if (error) {
        alert("error");
    } else {
        alert("アカウントが登録されました！");
    }
});

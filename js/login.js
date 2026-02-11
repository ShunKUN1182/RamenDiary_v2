import { supabase } from "./supabase.js";

const databaseName = "user_data";
const userID = document.querySelector("#userID");
const userPass = document.querySelector("#userPass");
const submitBtn = document.querySelector("#submitBtn");

submitBtn.addEventListener("click", async () => {
    const ID = userID.value;
    const PS = userPass.value;

    if (!ID || !PS) {
        alert("IDとパスワードを入力してください");
        return;
    }

    const { data, error } = await supabase
        .from(databaseName)
        .select("*")
        .eq("userID", ID)
        .eq("password", PS)
        .single();

    if (error) {
        alert("IDまたはパスワードが違います");
        console.log(error);
        return;
    }

    localStorage.setItem("loginUser", JSON.stringify(data));

    alert(`ログイン成功！ようこそ ${data.name} さん！`);

    window.location.href = "./index.html";
});

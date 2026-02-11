import { supabase } from "./supabase.js";

const bucketName = "ramen_images";
const databaseName = "ramen_data";
const submitBtn = document.querySelector("#submit_btn");
const ramenImage = document.querySelector("#addPicture");
const textData = document.querySelector("#textData");
const ramenDate = document.querySelector("#ramenDate");
const ramenPrice = document.querySelector("#ramenPrice");
const ramenTaste = document.querySelector("#ramenTaste");
const changePicture = document.querySelector("#changePicture");
const loginUser = JSON.parse(localStorage.getItem("loginUser"));

if (!loginUser) {
    alert("ログインしてください");
    window.location.href = "./login.html";
}

const today = new Date();
console.log(today);
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
console.log(yyyy, mm, dd);

ramenDate.value = `${yyyy}-${mm}-${dd}`;

ramenImage.addEventListener("change", () => {
    const file = ramenImage.files[0];
    const fileName = URL.createObjectURL(file);

    changePicture.innerHTML = `
                    <label for="addPicture">
                        <img src="${fileName}" alt="" />
                        <span>写真が追加されました！</span>
                    </label>
    `;
});

submitBtn.addEventListener("click", async () => {
    let file = ramenImage.files[0];
    if (!file) {
        alert("画像を選択してください");
        // ここは将来的にない場合はそのまま通して画像をnotImageに差し替える
        return;
    }
    console.dir(file);
    const reFile = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${reFile}`;
    console.log(fileName);
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);
    console.log("data:", uploadData);
    console.log("error:", uploadError);
    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    console.log(urlData);

    const { data: insertData, error: insertError } = await supabase.from(databaseName).insert({
        userID: loginUser.id,
        image_url: urlData.publicUrl,
        ramen_name: textData.value,
        ramen_price: ramenPrice.valueAsNumber,
        ramen_taste: ramenTaste.value,
        ramen_date: ramenDate.value,
    });
    if (insertError) {
        console.log(insertError);
        alert("error");
    } else {
        location.reload();
        alert("データが登録されました！");
    }
});

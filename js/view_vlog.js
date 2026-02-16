import { supabase } from "./supabase.js";

const ramenDatas = document.querySelector(".ramen_datas");
const ramenFilter = document.querySelector("#ramenFilter");
const databaseName = "ramen_data";
const loginUser = JSON.parse(localStorage.getItem("loginUser"));

if (!loginUser) {
    alert("ログインしてください");
    window.location.href = "./login.html";
}

let ramenBox = [];

async function loadData() {
    const { data, error } = await supabase
        .from(databaseName)
        .select("*")
        .eq("userID", loginUser.id);
    console.log("data:", data);
    console.log("error:", error);

    for (let i = 0; i < data.length; i++) {
        if (data[i].ramen_date) {
            let timeData = data[i].ramen_date.split("-");
            ramenBox.push({
                image_url: data[i].image_url,
                ramen_name: data[i].ramen_name,
                ramen_taste: data[i].ramen_taste,
                timeData: timeData,
                sortTimeData: data[i].ramen_date,
                ramen_price: data[i].ramen_price,
            });
        }
    }

    let newRamenBox = ramenBox.sort(
        (a, b) => Date.parse(a.sortTimeData) - Date.parse(b.sortTimeData),
    );
    console.log(newRamenBox);

    outputRamen(newRamenBox);
}

function outputRamen(box) {
    ramenDatas.innerHTML = "";
    box.forEach((r) => {
        ramenDatas.insertAdjacentHTML(
            "afterbegin",
            `
                    <div class="ramen_data">
                        <img src="${r.image_url}" alt="" />
                        <div class="ramen_data_text">
                            <div class="ramen_data_shop">
                                <h2>${r.ramen_name}</h2>
                                <p>${r.ramen_taste}</p>
                            </div>
                            <div class="ramen_data_option">
                                <p>
                                    <time datetime="${r.timeData}">${r.timeData[0]}年${r.timeData[1]}月${r.timeData[2]}日</time>
                                </p>
                                <h3>¥${r.ramen_price}</h3>
                            </div>
                        </div>
                    </div>
                `,
        );
    });
}

loadData();

ramenFilter.addEventListener("input", (e) => {
    let NewramenBox = ramenBox.filter((ramenBox) => ramenBox.ramen_name.includes(e.target.value));
    outputRamen(NewramenBox);
});

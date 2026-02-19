import { supabase } from "./supabase.js";

const ramenDatas = document.querySelector(".ramen_datas");
const ramenLists = document.querySelector(".ramen_lists");
const ramenFilter = document.querySelector("#ramenFilter");
const databaseName = "ramen_data";
const loginUser = JSON.parse(localStorage.getItem("loginUser"));
const sort = document.querySelector("#sort");
const filter = document.querySelector("#filter");
const changeMode = document.querySelector(".change_mode");
const modeInput = document.querySelector("#modeInput");

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
                ramen_map: data[i].ramen_map,
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
    ramenLists.innerHTML = "";
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
                            <div>
                                <p><span></span>${r.ramen_map}</p>
                                <p><span></span><time datetime="${r.sortTimeData}">${r.timeData[0]}年${r.timeData[1]}月${r.timeData[2]}日</time></p>
                            </div>
                            <h3>¥${r.ramen_price}</h3>
                        </div>
                    </div>
                </div>
                `,
        );
        ramenLists.insertAdjacentHTML(
            "afterbegin",
            `
                <div class="ramen_list">
                    <img src="${r.image_url}" alt="" />
                    <div class="ramen_list_text">
                        <h2>${r.ramen_name}</h2>
                        <h3>${r.ramen_taste}</h3>
                        <div class="ramen_list_option">
                            <h4>¥${r.ramen_price}</h4>
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

sort.addEventListener("change", () => {
    sortCheck();
    filterCheck();
});

filter.addEventListener("change", () => {
    sortCheck();
    filterCheck();
});

let modeCheck = "off";

changeMode.addEventListener("change", () => {
    modeInput.classList.toggle("mode_on");
    ramenDatas.removeAttribute("id");
    ramenLists.removeAttribute("id");
    if (modeCheck == "on") {
        ramenLists.setAttribute("id", "modeOff");
        modeCheck = "off";
    } else {
        ramenDatas.setAttribute("id", "modeOff");
        modeCheck = "on";
    }
});

function sortCheck() {
    if (sort.value == "new") {
        let NewramenBox = ramenBox.sort(
            (a, b) => Date.parse(a.sortTimeData) - Date.parse(b.sortTimeData),
        );
        outputRamen(NewramenBox);
    } else if (sort.value == "old") {
        let NewramenBox = ramenBox.sort(
            (a, b) => Date.parse(b.sortTimeData) - Date.parse(a.sortTimeData),
        );
        outputRamen(NewramenBox);
    } else if (sort.value == "high") {
        let NewramenBox = ramenBox.sort((a, b) => a.ramen_price - b.ramen_price);
        outputRamen(NewramenBox);
    } else if (sort.value == "row") {
        let NewramenBox = ramenBox.sort((a, b) => b.ramen_price - a.ramen_price);
        outputRamen(NewramenBox);
    }
}

function filterCheck() {
    if (filter.value == "shouyu") {
        let NewramenBox = ramenBox.filter((ramenBox) => ramenBox.ramen_taste == "しょうゆ");
        outputRamen(NewramenBox);
    } else if (filter.value == "miso") {
        let NewramenBox = ramenBox.filter((ramenBox) => ramenBox.ramen_taste == "みそ");
        outputRamen(NewramenBox);
    } else if (filter.value == "sio") {
        let NewramenBox = ramenBox.filter((ramenBox) => ramenBox.ramen_taste == "しお");
        outputRamen(NewramenBox);
    } else if (filter.value == "tonkotu") {
        let NewramenBox = ramenBox.filter((ramenBox) => ramenBox.ramen_taste == "とんこつ");
        outputRamen(NewramenBox);
    } else if (filter.value == "toripaitan") {
        let NewramenBox = ramenBox.filter((ramenBox) => ramenBox.ramen_taste == "鶏白湯");
        outputRamen(NewramenBox);
    } else if (filter.value == "tukemen") {
        let NewramenBox = ramenBox.filter((ramenBox) => ramenBox.ramen_taste == "つけ麺");
        outputRamen(NewramenBox);
    } else if (filter.value == "jirou") {
        let NewramenBox = ramenBox.filter((ramenBox) => ramenBox.ramen_taste == "二郎系");
        outputRamen(NewramenBox);
    } else if (filter.value == "iekei") {
        let NewramenBox = ramenBox.filter((ramenBox) => ramenBox.ramen_taste == "家系");
        outputRamen(NewramenBox);
    } else if (filter.value == "mazesoba") {
        let NewramenBox = ramenBox.filter((ramenBox) => ramenBox.ramen_taste == "まぜそば");
        outputRamen(NewramenBox);
    } else {
        outputRamen(ramenBox);
    }
}

import { supabase } from "./supabase.js";

const ramenDatas = document.querySelector(".ramen_datas");

async function loadData() {
    const { data, error } = await supabase.from("ramen_data").select("*");
    console.log("data:", data);
    console.log("error:", error);
    for (let i = 0; i < data.length; i++) {
        if (data[i].ramen_date) {
            let timeData = data[i].ramen_date.split("-");
            ramenDatas.insertAdjacentHTML(
                "beforeend",
                `
                    <div class="ramen_data">
                        <img src="${data[i].image_url}" alt="" />
                        <div class="ramen_data_text">
                            <div class="ramen_data_shop">
                                <h2>${data[i].ramen_name}</h2>
                                <p>${data[i].ramen_taste}</p>
                            </div>
                            <div class="ramen_data_option">
                                <p>
                                    <time datetime="${timeData}">${timeData[0]}年${timeData[1]}月${timeData[2]}日</time>
                                </p>
                                <h3>¥${data[i].ramen_price}</h3>
                            </div>
                        </div>
                    </div>
                `,
            );
        }
    }
}

loadData();

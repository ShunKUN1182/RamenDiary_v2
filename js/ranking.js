import { supabase } from "./supabase.js";

const rankingOutput = document.querySelector(".ranking_Wrap");
const ramenDatabaseName = "ramen_data";
const userDatabaseName = "user_data";
const loginUser = JSON.parse(localStorage.getItem("loginUser"));

if (!loginUser) {
    alert("ログインしてください");
    window.location.href = "./login.html";
}

async function loadRanking() {
    const { data: ramenData, error: ramenError } = await supabase
        .from(ramenDatabaseName)
        .select("*");
    const { data: userData, error: userError } = await supabase.from(userDatabaseName).select("*");

    if (ramenError || userError) {
        console.log(ramenError, userError);
        return;
    }

    const rankingObj = {};

    for (let i = 0; i < ramenData.length; i++) {
        const userID = ramenData[i].userID;
        const price = ramenData[i].ramen_price;

        if (!rankingObj[userID]) {
            rankingObj[userID] = {
                userID: userID,
                ramen_count: 0,
                total_price: 0,
            };
        }

        rankingObj[userID].ramen_count++;
        rankingObj[userID].total_price += price;
    }

    let rankingArray = Object.values(rankingObj);

    rankingArray = rankingArray.map((rank) => {
        const user = userData.find((u) => u.id === rank.userID);

        return {
            ...rank,
            user_name: user ? user.name : "名無しさん",
        };
    });

    rankingArray.sort((a, b) => b.total_price - a.total_price);

    rankingArray.forEach((e, i) => {
        e.rank = i + 1;
    });

    console.log(rankingArray);

    for (let i = 0; i < rankingArray.length; i++) {
        if (loginUser.id === rankingArray[i].userID) {
            rankingOutput.insertAdjacentHTML(
                "beforeend",
                `
            <div class="ranking_item" id="myCard">
                <span id="banner">あなた</span>
                <div class="rank">
                    <h3>${rankingArray[i].rank}</h3>
                </div>
                <div class="ranking_item_texts">
                    <div class="ranking_item_data">
                        <h2>${rankingArray[i].user_name}</h2>
                        <p><span>${rankingArray[i].ramen_count}</span>杯のラーメンを記録</p>
                    </div>
                    <div class="ranking_item_price">
                        <h3>¥${rankingArray[i].total_price}</h3>
                    </div>
                </div>
            </div>
          `,
            );
        } else {
            rankingOutput.insertAdjacentHTML(
                "beforeend",
                `
              <div class="ranking_item">
                  <div class="rank">
                      <h3>${rankingArray[i].rank}</h3>
                  </div>
                  <div class="ranking_item_texts">
                      <div class="ranking_item_data">
                          <h2>${rankingArray[i].user_name}</h2>
                          <p><span>${rankingArray[i].ramen_count}</span>杯のラーメンを記録</p>
                      </div>
                      <div class="ranking_item_price">
                          <h3>¥${rankingArray[i].total_price}</h3>
                      </div>
                  </div>
              </div>
            `,
            );
        }
    }
}

loadRanking();

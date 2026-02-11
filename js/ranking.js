import { supabase } from "./supabase.js";

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
            user_name: user ? user.user_name : "名無しさん",
        };
    });

    rankingArray.sort((a, b) => b.total_price - a.total_price);

    rankingArray.forEach((e, i) => {
        e.rank = i + 1;
    });

    console.log(rankingArray);
}

loadRanking();

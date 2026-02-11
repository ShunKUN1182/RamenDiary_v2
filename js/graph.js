import { supabase } from "./supabase.js";

const ramenCount = document.querySelector("#ramenCount");
const priceOutput = document.querySelector("#totalPrice");
const ctx = document.getElementById("tasteChart");

async function totalPrice() {
    const { data, error } = await supabase.from("ramen_data").select("ramen_price");

    if (error) {
        console.log(error);
        return;
    }

    ramenCount.innerHTML = data.length;

    let priceBox = [];
    for (let i = 0; i < data.length; i++) {
        priceBox.push(Number(data[i].ramen_price));
    }

    const totalPrice = priceBox.reduce((current, currentVal) => {
        return current + currentVal;
    }, 0);

    priceOutput.innerHTML = totalPrice;
}

totalPrice();

async function tasteChart() {
    const { data, error } = await supabase.from("ramen_data").select("ramen_taste");

    if (error) {
        console.log(error);
        return;
    }

    console.log(data);

    let tasteDatas = [];

    for (let i = 0; i < data.length; i++) {
        tasteDatas.push(data[i].ramen_taste);
    }

    const countsObj = tasteDatas.reduce((current, currentVal) => {
        current[currentVal] = (current[currentVal] || 0) + 1;
        return current;
    }, {});

    const countResult = Object.entries(countsObj).map(([name, count]) => {
        return { name, count };
    });

    console.log(countResult);

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: countResult.map((item) => item.name),
            datasets: [
                {
                    label: " 食べた数",
                    data: countResult.map((item) => item.count),
                    borderWidth: 5,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        padding: 20,
                    },
                },
            },
        },
    });
}

tasteChart();

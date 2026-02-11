async function createTasteChart() {
    const { data, error } = await supabase.from("ramen_data").select("*");

    if (error) {
        console.error("取得エラー:", error);
        return;
    }

    const tasteCount = {};

    data.forEach((item) => {
        const taste = item.ramen_taste;
        if (!tasteCount[taste]) {
            tasteCount[taste] = 0;
        }
        tasteCount[taste]++;
    });

    const labels = Object.keys(tasteCount);
    const counts = Object.values(tasteCount);

    const ctx = document.getElementById("tasteChart");

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [
                {
                    data: counts,
                    backgroundColor: [
                        "#ff4646ff",
                        "#83f7ffff",
                        "#ff78d6ff",
                        "#ffc227ff",
                        "#0404c0ff",
                    ],
                },
            ],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: 0, // グラフ周りに少し余白
            },
            plugins: {
                title: {
                    display: true,
                    font: { size: 10 },
                },
                legend: {
                    position: "right", // ← ここを追加するだけ！！
                    labels: {
                        font: { size: 14 },
                        boxWidth: 15, // 右側にした時に見やすいサイズ
                        padding: 10,
                    },
                },
            },
        },
    });
}

createTasteChart();

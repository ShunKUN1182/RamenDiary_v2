const textData = document.querySelector("#text_data");
const numberData = document.querySelector("#number_data");
const ramenTaste = document.querySelector("#ramen_taste");
const ramenJudge = document.querySelector("#ramen_judge");
const submitBtn = document.querySelector("#submit_btn");
const ramenImage = document.querySelector("#ramen_image");
const bucketName = "ramen_images";
const addPhoto = document.querySelector("#add_photo");

const supabaseUrl = "https://gcflelpasndsydtugmja.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZmxlbHBhc25kc3lkdHVnbWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMDMwMTMsImV4cCI6MjA4MDY3OTAxM30.YlQYvRSJ8-7uJMb7OsoB8HbuQGT7hSZ-NJIW6Q2Xllk";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

ramenImage.addEventListener("change", () => {
    const file = ramenImage.files[0];
    console.dir(addPhoto);
    const imageURL = URL.createObjectURL(file);

    addPhoto.innerHTML = `
                        <img src="${imageURL}"
                            alt="画像追加されました"
                            width="250"
                            height="150"
                        />`;
});

submitBtn.addEventListener("click", async () => {
    let file = ramenImage.files[0];
    console.log(file);
    const fileName = `${crypto.randomUUID()}.${file.name.split(".").pop()}`;
    console.log(fileName);
    const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file);
    console.log("data:", data);
    console.log("error:", error);
    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    console.log(urlData);
    await supabase.from("ramen_data").insert({
        image_url: urlData.publicUrl,
        ramen_name: textData.value,
        ramen_price: numberData.value,
        ramen_taste: ramenTaste.value,
        ramen_judge: ramenJudge.value,
    });
    if (error) {
        alert("error");
    } else {
        location.reload();
        alert("データ追加成功");
    }
});

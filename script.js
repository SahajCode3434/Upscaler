const imageUpload = document.getElementById("imageUpload");
const previewImage = document.getElementById("previewImage");
const resultImage = document.getElementById("resultImage");
const submitBtn = document.getElementById("submitBtn");
const loader = document.getElementById("loading");
const previewContainer = document.getElementById("previewContainer");
const resultContainer = document.getElementById("resultContainer");
const downloadBtn = document.getElementById("downloadBtn");
const chimeSound = document.getElementById("chimeSound");

let uploadedImage = null;

imageUpload.addEventListener("change", () => {
  const file = imageUpload.files[0];
  if (file) {
    uploadedImage = file;
    const reader = new FileReader();
    reader.onload = () => {
      previewImage.src = reader.result;
      previewContainer.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
});

submitBtn.addEventListener("click", async () => {
  if (!uploadedImage) {
    alert("Please upload an image first.");
    return;
  }

  loader.classList.remove("hidden");
  resultContainer.classList.add("hidden");
  resultImage.src = "";

  const formData = new FormData();
  formData.append("image", uploadedImage);

  try {
    const response = await fetch("https://tree1.sahajsharma921.workers.dev", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Upscaling failed");

    const blob = await response.blob();
    const imageURL = URL.createObjectURL(blob);

    resultImage.src = imageURL;
    resultContainer.classList.remove("hidden");
    chimeSound.play();

    downloadBtn.onclick = () => {
      const link = document.createElement("a");
      link.href = imageURL;
      link.download = "hikari-upscaled.png";
      link.click();
    };
  } catch (error) {
    alert("Upscale failed. Try again later.");
    console.error(error);
  } finally {
    loader.classList.add("hidden");
  }
});

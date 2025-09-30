document.addEventListener("DOMContentLoaded", function () {
  const generateBtn = document.getElementById("wpgqls_generate_key_btn");
  const keyInput = document.getElementById("wpgqls_secret_key_input");

  if (generateBtn && keyInput) {
    generateBtn.addEventListener("click", function () {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let newKey = "";
      for (let i = 0; i < 64; i++) {
        newKey += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      keyInput.value = newKey;
    });
  }
});

(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()
(() => {
  "use strict";
  document.querySelectorAll(".needs-validation").forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) { event.preventDefault(); event.stopPropagation(); }
      form.classList.add("was-validated");
    });
  });

  document.querySelectorAll(".password-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input");
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      button.innerHTML = `<i class="fa-regular fa-eye${isHidden ? "-slash" : ""}"></i>`;
      button.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    });
  });

  const password = document.querySelector("#password");
  const strength = document.querySelector("#passwordStrength");
  if (password && strength) password.addEventListener("input", () => {
    const score = [password.value.length >= 8, /[A-Z]/.test(password.value), /[0-9]/.test(password.value), /[^A-Za-z0-9]/.test(password.value)].filter(Boolean).length;
    const labels = ["Use 8+ characters", "Getting started", "Good password", "Strong password", "Excellent password"];
    strength.textContent = labels[score];
    strength.dataset.score = score;
  });
})();


document.addEventListener("DOMContentLoaded", function () {

    function showError(input, message) {
        input.style.border = "2px solid red";
        input.placeholder = message;
    }

    function showSuccess(input, message) {
        input.style.border = "2px solid green";
        input.placeholder = message;
    }

    function resetInput(input, defaultPlaceholder = "") {
        input.style.border = "1px solid #ccc";
        input.placeholder = defaultPlaceholder;
    }

    const username = document.querySelector('input[name="username"]');
    const email = document.querySelector('input[name="email"]');
    const password = document.querySelector('input[name="password"]');
    const confirmPassword = document.querySelector('input[name="confirm_password"]');

    const originalPlaceholders = {
        username: username.placeholder,
        email: email.placeholder,
        password: password.placeholder,
        confirm: confirmPassword.placeholder
    };

    // Username
    username.addEventListener("keyup", () => {
        if (username.value.length >= 3 && /^[A-Za-z0-9_]+$/.test(username.value)) {
            showSuccess(username, "Valid username ✔");
        } else {
            showError(username, "Min 3 chars, letters/numbers/_");
        }
    });

    // Email
    email.addEventListener("keyup", () => {
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (emailRegex.test(email.value)) {
            showSuccess(email, "Valid email ✔");
        } else {
            showError(email, "Enter valid email");
        }
    });

    // Password
    password.addEventListener("keyup", () => {
        let errors = [];
        if (password.value.length < 8) errors.push("8 chars");
        if (!/[A-Z]/.test(password.value)) errors.push("1 uppercase");
        if (!/[a-z]/.test(password.value)) errors.push("1 lowercase");
        if (!/[0-9]/.test(password.value)) errors.push("1 number");
        if (!/[!@#$%^&*]/.test(password.value)) errors.push("1 special");

        if (errors.length === 0) {
            showSuccess(password, "Strong password ✔");
        } else {
            showError(password, errors.join(", "));
        }

        confirmPassword.dispatchEvent(new Event("keyup"));
    });

    // Confirm password
    confirmPassword.addEventListener("keyup", () => {
        if (confirmPassword.value === password.value && confirmPassword.value !== "") {
            showSuccess(confirmPassword, "Passwords match ✔");
        } else {
            showError(confirmPassword, "Passwords do not match");
        }
    });

});



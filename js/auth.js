 const USER_STORAGE_KEY = "dayliUser";
const LOGIN_STORAGE_KEY = "dayliLoggedIn";

const API_BASE_URL = "http://localhost:5000/api";


// ===============================
// Get Saved User
// ===============================
function getSavedUser() {

    try {

        const user = JSON.parse(
            localStorage.getItem(USER_STORAGE_KEY)
        );

        return user || null;

    } catch (error) {

        console.error("Unable to read user:", error);

        return null;
    }
}


// ===============================
// Save User
// ===============================
function saveUser(user) {

    localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(user)
    );
}


// ===============================
// REGISTER
// ===============================
async function handleRegister(event) {

    event.preventDefault();

    const form = event.target;

    const inputs = form.querySelectorAll("input");
    const textarea = form.querySelector("textarea");

    const name = inputs[0]?.value.trim();
    const email = inputs[1]?.value.trim();
    const phone = inputs[2]?.value.trim();
    const address = textarea?.value.trim();
    const password = inputs[3]?.value;
    const confirmPassword = inputs[4]?.value;


    // ===============================
    // Check empty fields
    // ===============================

    if (
        !name ||
        !email ||
        !phone ||
        !address ||
        !password ||
        !confirmPassword
    ) {

        alert("Please fill in all fields.");

        return;
    }


    // ===============================
    // Password length
    // ===============================

    if (password.length < 6) {

        alert(
            "Password must be at least 6 characters."
        );

        return;
    }


    // ===============================
    // Confirm password
    // ===============================

    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;
    }


    // ===============================
    // Register with Backend
    // ===============================

    try {

        const response = await fetch(
            `${API_BASE_URL}/auth/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    phone: phone,
                    address: address
                })
            }
        );


        const data = await response.json();


        // ===============================
        // Backend error
        // ===============================

        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Registration failed."
            );

            return;
        }
  // ===============================
// Registration successful
// ===============================

// User is registered, but NOT logged in yet
localStorage.removeItem(USER_STORAGE_KEY);
localStorage.removeItem(LOGIN_STORAGE_KEY);

alert("Registration successful!");

 alert("Registration successful!");

setTimeout(function () {
    window.location.href = "./login.html";
}, 100);


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        alert(
            "Unable to connect to the server.\n\n" +
            "Please make sure the Dayli Need Shop server is running."
        );
    }
}


// ===============================
// LOGIN
// ===============================
async function handleLogin(event) {

    event.preventDefault();

    const form = event.target;


    const email =
        form.querySelector(
            'input[type="email"]'
        )?.value.trim();


    const password =
        form.querySelector(
            'input[type="password"]'
        )?.value;


    // ===============================
    // Check empty fields
    // ===============================

    if (!email || !password) {

        alert(
            "Please enter your email and password."
        );

        return;
    }


    // ===============================
    // Login with Backend
    // ===============================

    try {

        const response = await fetch(
            `${API_BASE_URL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        // ===============================
        // Login error
        // ===============================

        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Invalid email or password."
            );

            return;
        }


        // ===============================
        // Save backend user
        // ===============================

        saveUser(data.user);


        localStorage.setItem(
            LOGIN_STORAGE_KEY,
            "true"
        );


        alert("Login successful!");


        window.location.href = "profile.html";


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        alert(
            "Unable to connect to the server.\n\n" +
            "Please make sure the Dayli Need Shop server is running."
        );
    }
}


// ===============================
// LOGOUT
// ===============================
function logoutUser() {

    localStorage.removeItem(
        LOGIN_STORAGE_KEY
    );

    localStorage.removeItem(
        USER_STORAGE_KEY
    );

    alert("You have been logged out.");

    window.location.href = "login.html";
}


// ===============================
// INITIALIZE
// ===============================
document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ===============================
        // Register form
        // ===============================

        const registerForm =
            document.querySelector(
                ".register-form"
            );


        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                handleRegister
            );
        }


        // ===============================
        // Login form
        // ===============================

        const loginForm =
            document.querySelector(
                ".login-form"
            );


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                handleLogin
            );
        }


        // ===============================
        // Logout button
        // ===============================

        const logoutButton =
            document.getElementById(
                "logoutBtn"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logoutUser
            );
        }

    }
);
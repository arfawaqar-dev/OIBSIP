// Get registered users from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}


// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}


// SHA-256 password hashing
async function hashPassword(password) {

    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


// Registration
const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const username = document
            .getElementById("username")
            .value
            .trim();

        const email = document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();

        const password = document
            .getElementById("registerPassword")
            .value;

        const message = document.getElementById("registerMessage");

        // Empty field validation
        if (!username || !email || !password) {

            message.textContent = "Please fill in all fields.";
            message.style.color = "#ff6b6b";

            return;
        }


        // Password validation
        if (password.length < 8 || !/\d/.test(password)) {

            message.textContent =
                "Password must be at least 8 characters and contain at least 1 number.";

            message.style.color = "#ff6b6b";

            return;
        }


        const users = getUsers();


        // Duplicate username/email check
        const userExists = users.some(user =>
            user.username.toLowerCase() === username.toLowerCase() ||
            user.email.toLowerCase() === email
        );


        if (userExists) {

            message.textContent =
                "Username or email already exists.";

            message.style.color = "#ff6b6b";

            return;
        }


        // Hash password before storing
        const hashedPassword = await hashPassword(password);


        const newUser = {
            username: username,
            email: email,
            password: hashedPassword
        };


        users.push(newUser);

        saveUsers(users);


        message.textContent =
            "Registration successful! Redirecting to login...";

        message.style.color = "#4ade80";


        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);

    });
}


// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const identifier = document
            .getElementById("loginIdentifier")
            .value
            .trim()
            .toLowerCase();

        const password = document
            .getElementById("loginPassword")
            .value;

        const message = document.getElementById("loginMessage");


        // Empty field validation
        if (!identifier || !password) {

            message.textContent =
                "Please enter your username/email and password.";

            message.style.color = "#ff6b6b";

            return;
        }


        const users = getUsers();

        const hashedPassword = await hashPassword(password);


        // Check credentials
        const user = users.find(user =>
            (
                user.username.toLowerCase() === identifier ||
                user.email.toLowerCase() === identifier
            ) &&
            user.password === hashedPassword
        );


        if (!user) {

            // Do not reveal which credential is incorrect
            message.textContent =
                "Invalid username/email or password.";

            message.style.color = "#ff6b6b";

            return;
        }


        // Create login session
        sessionStorage.setItem(
            "loggedInUser",
            JSON.stringify({
                username: user.username,
                email: user.email
            })
        );


        window.location.href = "dashboard.html";

    });
}


// Protect dashboard
if (window.location.pathname.endsWith("dashboard.html")) {

    const session = sessionStorage.getItem("loggedInUser");


    if (!session) {

        window.location.href = "index.html";

    } else {

        const user = JSON.parse(session);

        const displayUsername =
            document.getElementById("displayUsername");

        if (displayUsername) {
            displayUsername.textContent = user.username;
        }

    }
}


// Logout
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function() {

        sessionStorage.removeItem("loggedInUser");

        window.location.href = "index.html";

    });
}
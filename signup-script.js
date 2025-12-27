const signupForm = document.getElementById('signupForm');
const errorBox = document.getElementById('errorBox');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Clear previous errors
    errorBox.style.display = 'none';
    errorBox.textContent = '';

    // Client-side validation regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{9,}$/;

    if (!passwordRegex.test(password)) {
        errorBox.textContent = "Password must be at least 9 characters long and contain a lowercase letter, an uppercase letter, and a special character.";
        errorBox.style.display = 'block';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.status === 201) {
            alert('Account Created Successfully! Redirecting to login...');
            window.location.href = 'login.html';
        } else {
            errorBox.textContent = data.message || "Signup failed.";
            errorBox.style.display = 'block';
        }

    } catch (err) {
        console.error(err);
        errorBox.textContent = "Cannot connect to server. Is the Node.js backend running?";
        errorBox.style.display = 'block';
    }
});
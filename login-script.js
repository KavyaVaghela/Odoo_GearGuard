const loginForm = document.getElementById('loginForm');
const errorBox = document.getElementById('errorBox');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Clear previous errors
    errorBox.style.display = 'none';
    errorBox.textContent = '';

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.status === 200) {
            alert(`Welcome back! Role: ${data.role}`);
            // Redirect to dashboard
            // Ensure dashboard.html exists or change this to your home page
            window.location.href = 'dashboard.html'; 
        } else {
            errorBox.textContent = data.message || "Login failed.";
            errorBox.style.display = 'block';
        }

    } catch (err) {
        console.error(err);
        errorBox.textContent = "Cannot connect to server. Is the Node.js backend running?";
        errorBox.style.display = 'block';
    }
});
// Define the API URL
const apiUrl = 'http://localhost:6000';

// Event listener for login form submission
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    // Handle successful login (e.g., store token, redirect, etc.)
    console.log('Logged in:', data);
  } catch (error) {
    console.error('Login failed:', error);
  }
});

// Event listener for registration form submission
document.getElementById('registration-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const newUsername = document.getElementById('new-username').value;
  const newPassword = document.getElementById('new-password').value;

  try {
    const response = await axios.post(`${apiUrl}/register`, {
      username: newUsername,
      password: newPassword,
    });
    // Handle successful registration (e.g., show success message)
    console.log('Registered:', response.data);
  } catch (error) {
    console.error('Registration failed:', error);
  }
});

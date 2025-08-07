document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = {
    fullName: document.getElementById('fullName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    password: document.getElementById('password').value, // <-- هنا التصحيح
    role: "client",
  };

  try {
    const response = await fetch('http://localhost:5000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      alert('Successfully signed up!');
      window.location.href = "/public/authentication/login.html";
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
});
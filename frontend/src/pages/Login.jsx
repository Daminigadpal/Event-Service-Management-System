// frontend/src/pages/Login.jsx
const onSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      onLogin(data.user);
      navigate('/customer/dashboard');  // Add this line
    } else {
      setError(data.message || 'Login failed');
    }
  } catch (err) {
    setError('An error occurred. Please try again.');
  }
};
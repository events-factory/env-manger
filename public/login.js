document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  
  loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      
      const loginData = {
        username: username,
        password: password
      };
      
      try {
        const response = await fetch('/api/project/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData)
        });

        const responseData = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Login successful.'
          }).then(() => {
            localStorage.setItem('authToken', responseData.token);
            localStorage.setItem('username', responseData.username);
            window.location.href = '/';
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: responseData.message
          });
        }
      } catch (error) {
        console.error('An error occurred:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred during login.'
        });
      }
  });
});

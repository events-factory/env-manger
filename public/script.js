document.addEventListener("DOMContentLoaded", function() {
  const createProjectButton = document.getElementById("createProjectButton");
  const projectList = document.getElementById("projectList");

  if (localStorage.getItem('username')) {
    document.getElementById("avatar").innerHTML = localStorage.getItem('username').replace('.', ' ').split(' ')[0]
    document.getElementById("userName").innerText = `Welcome ${localStorage.getItem('username').replace('.', ' ').split(' ')[1]}`;
  }

  const getAuthToken = async () => {
    const authToken = await localStorage.getItem('authToken');
    if (authToken) {
      return authToken;
    } else {
      return null;
    }
  };

  async function handleFetchResponse(response) {
    if (response.status === 401) {
      console.log("Status 403 - Open login modal");
      window.location.href = "/login.html";
    }
    return response;
  }


  createProjectButton.addEventListener("click", async function() {
    Swal.fire({
      title: 'Enter project name',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Submit',
      showLoaderOnConfirm: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
        if (!/^[a-zA-Z0-9- ]*$/.test(value)) {
          return 'Special characters are not allowed.'
        }
      },
      preConfirm: async (projectName) => {
        try {
          const response = await fetch(`/api/project`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': await getAuthToken()
            },
            body: JSON.stringify({
              projectName
            })
          });
          handleFetchResponse(response);
          if (response.ok) {
            renderProjects();
          } else {
            throw new Error('Error creating project.');
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
          });
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Project created successfully.'
        });
      }
    });
  });

  let logoutButton = document.getElementById("logoutButton");

  logoutButton.addEventListener("click", async function() {
    let logout = await fetch('/api/project/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': await getAuthToken()
      }
    });
    if (logout.ok) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      window.location.href = "/login.html";
    }
  });

  async function renderProjects() {
    const response = await fetch(`/api/project`, {
      headers: {
        'Authorization': await getAuthToken()
      }
    });
    const projects = await response.json();
    handleFetchResponse(response);
    projectList.innerHTML = '';
    if (Array.isArray(projects)) {
      projects.forEach(async project => {
        const projectElement = document.createElement("div");
        projectElement.className = "project";
        projectElement.innerHTML = `
                  <h2 class="text-capitalize">${project.name.replace(/-/g, ' ')}</h2>
                  <p class="text-muted">Path: <code>${project.path}</code></p>
                  <button class="btn btn-primary text-white createEnvButton" data-project="${project.name}">Create .env</button>
                  <button class="btn btn-info text-white readEnvButton" data-project="${project.name}">Read .env</button>
              `;
        projectList.appendChild(projectElement);
  
        const createEnvButton = projectElement.querySelector(".createEnvButton");
        const readEnvButton = projectElement.querySelector(".readEnvButton");
  
        const envResponse = await fetch(`/api/project/${project.name}/env`, {
          method: 'HEAD',
          headers: {
            'Authorization': await getAuthToken()
          }
        });
        handleFetchResponse(envResponse);
        if (envResponse.ok) {
          createEnvButton.style.display = "none";
          readEnvButton.style.display = "block";
        } else {
          readEnvButton.style.display = "none";
        }
  
        createEnvButton.addEventListener("click", async function() {
          const response = await fetch(`/api/project/${project.name}/env`, {
            method: 'POST',
            headers: {
              'Authorization': await getAuthToken()
            }
          });
          handleFetchResponse(response);
          if (response.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: '.env file created successfully for project: ' + project.name
            }).then(() => {
              createEnvButton.style.display = "none";
              readEnvButton.style.display = "block";
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error creating .env file.'
            });
          }
        });
  
        readEnvButton.addEventListener("click", async function() {
          const envResponse = await fetch(`/api/project/${project.name}/env`, {
            method: 'GET',
            headers: {
              'Authorization': await getAuthToken()
            }
          });
          handleFetchResponse(envResponse);
          if (envResponse.ok) {
            const envContent = await envResponse.text();
            document.getElementById("envContent").value = envContent;
            document.getElementById("envModal").style.display = "block";
            document.getElementById("modaltitle").innerText = `Project: ${project.name} - Environment Variables content`;
  
            const updateEnvButton = document.getElementById("updateEnvButton");
  
            updateEnvButton.addEventListener("click", async function() {
              const updatedEnvContent = document.getElementById("envContent").value;
  
              const updateResponse = await fetch(`/api/project/${project.name}/env`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': await getAuthToken()
                },
                body: JSON.stringify({
                  envContent: updatedEnvContent
                })
              });
              handleFetchResponse(updateResponse);
              if (updateResponse.ok) {
                Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: 'Environment variables updated successfully for project: ' + project.name
                }).then(() => {
                  document.getElementById("envModal").style.display = "none";
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Error updating .env file.'
                });
              }
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error reading .env file.'
            });
          }
        });
      });
    }
  }

  renderProjects();

  const modalCloseButton = document.querySelector(".btn-close");
  modalCloseButton.addEventListener("click", function() {
    document.getElementById("envModal").style.display = "none";
  });

  window.addEventListener("click", function(event) {
    const modal = document.getElementById("envModal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    let isSearchingUsers = true; // Track if searching for users or repos

    form.addEventListener('submit', async event => {
      event.preventDefault();
      const searchValue = document.getElementById('search').value.trim();
      if (searchValue) {
        try {
          if (isSearchingUsers) {
            const users = await searchUsers(searchValue);
            displayUsers(users);
          } else {
            const repos = await searchRepos(searchValue);
            displayRepos(repos);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    });

    userList.addEventListener('click', async event => {
      if (event.target.tagName === 'LI') {
        const username = event.target.getAttribute('data-username');
        try {
          const repos = await getUserRepos(username);
          displayRepos(repos);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    });

    function searchUsers(username) {
      return fetch(`https://api.github.com/search/users?q=${username}`)
        .then(response => response.json())
        .then(data => data.items);
    }

    function displayUsers(users) {
      userList.innerHTML = '';
      users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.login;
        li.setAttribute('data-username', user.login);
        userList.appendChild(li);
      });
    }

    function searchRepos(keyword) {
      return fetch(`https://api.github.com/search/repositories?q=${keyword}`)
        .then(response => response.json())
        .then(data => data.items);
    }

    function getUserRepos(username) {
      return fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json());
    }

    function displayRepos(repos) {
      reposList.innerHTML = '';
      repos.forEach(repo => {
        const li = document.createElement('li');
        li.textContent = repo.full_name;
        reposList.appendChild(li);
      });
    }

    const toggleButton = document.getElementById('toggle-button');
    toggleButton.addEventListener('click', () => {
      isSearchingUsers = !isSearchingUsers;
      form.reset();
      reposList.innerHTML = ''; // Clear repos list
      const placeholderText = isSearchingUsers ? 'Search users' : 'Search repositories';
      document.getElementById('search').setAttribute('placeholder', placeholderText);
    });
  });
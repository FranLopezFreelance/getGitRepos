//Get DOM Elements
let getReposFormElement = document.getElementById('get-repos-form');
let searchingBoxElement = document.getElementById('searching-box');
let userDataElement = document.getElementById('user-data');

let resultsBoxElement = document.getElementById('results-box');
let reposListElement = document.getElementById('repos-list');
let errorBoxElement = document.getElementById('error-box');
//Declare repos var 
let repos = [];

//Submit Actions
const submit = (e) => {
  e.preventDefault();
  searching();
  let userName = getReposFormElement.elements['userName'].value;
  if(validator(userName)){  
    getUser(userName)
      .then((userData) => {
        if(!userData.message){
          getReposByUsername(userName)
            .then(reposData => {
              if(reposData.length){
                injectReposData(reposData);
                injectUserData(userData);
                success();
              }else{
                //
              }
            })
            .catch((error) => {
              alert(error)
            });
        }else{
          error();
        }
      })
      .catch((error) => {
        alert(error);
      });
    
  }else{
    error();
  }
}

//Add event listener for submit event
getReposFormElement.addEventListener('submit', submit);

const validator = (value) => {
  return (value.length > 0 && !(value.trim() == ""));
}

//Display Elements for searching
const searching = () => {
  errorBoxElement.style.display = 'none';
  resultsBoxElement.style.display = 'none';
  searchingBoxElement.style.display = 'block';
  //Clear repos list element
  reposListElement.innerHTML = '';
}

//Display Elements for success
const success = () => {
  searchingBoxElement.style.display = 'none';
  errorBoxElement.style.display = 'none';
  resultsBoxElement.style.display = 'block';
}

//Display Elements for error
const error = () => {
  searchingBoxElement.style.display = 'none';
  resultsBoxElement.style.display = 'none';
  errorBoxElement.style.display = 'block';
}

//Get repos by user with fetch() api
const getUser = async (userName) => {
  let response = await fetch(`https://api.github.com/users/${userName}`);
  let data = response.json();
  return data;
}

//Get repos by user with fetch() api
const getReposByUsername = async (userName) => {
  let response = await fetch(`https://api.github.com/users/${userName}/repos`);
  let data = response.json();
  return data;
}

//Create templates for each repo with templates literal
const createUserDataTemplate = (userData) => {
  return  `<p class="user-name">@${userData.login}</p>
          <h2 class="full-name">${userData.name}</h2>
          <p class="bio">${userData.bio || "it doesn't have a bio" }</p>`;
}

//Create templates for each repo with templates literal
const createRepoDataTemplate = (repo) => {
  return `<li class="repo">
            <span class="repo-name">${ repo.name }</span>
            <span class="repo-data">
              <span class="repo-stars">
                <iconify-icon data-icon="octicon:star"></iconify-icon> ${ repo.stargazers_count }
              </span>
              <span class="repo-forks">
                <iconify-icon data-icon="octicon-repo-forked"></iconify-icon> ${ repo.forks_count }
              </span>
            </span>
          </li>`;
}

const injectUserData = (userData) => {
  userDataElement.innerHTML = createUserDataTemplate(userData);
}

const injectReposData = (reposData) => {
  repos = reposData;
  repos.map(repoData => {
    reposListElement.innerHTML += createRepoDataTemplate(repoData);
  });
}

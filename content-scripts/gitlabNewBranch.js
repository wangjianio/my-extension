const authenticity_token = document.querySelector('meta[name=csrf-token]').content;

const iconLoading = document.createElement('i');
iconLoading.className = 'fa fa-spinner fa-spin';

function createNewBranch(branchName, ref = 'master') {
  const formData = new FormData();
  formData.append('utf8', '1');
  formData.append('authenticity_token', authenticity_token);
  formData.append('branch_name', branchName);
  formData.append('ref', ref);
  fetch('branches', {
    method: 'POST',
    body: formData,
  }).then(() => {
    location.reload();
  });
}

function createMergeRequest(sourceBranch, targetBranch) {
  const projectId = document.getElementById('search_project_id').value;

  const formData = new FormData();
  formData.append('utf8', '1');
  formData.append('authenticity_token', authenticity_token);
  formData.append('merge_request[title]', `${sourceBranch} -> ${targetBranch}`);
  // formData.append('merge_request[description]', '');
  // formData.append('merge_request[assignee_id]', '');
  // formData.append('merge_request[label_ids]', '');
  formData.append('merge_request[force_remove_source_branch]', '0');
  // formData.append('merge_request[lock_version]', '');
  formData.append('merge_request[source_project_id]', projectId);
  formData.append('merge_request[source_branch]', sourceBranch);
  formData.append('merge_request[target_project_id]', projectId);
  formData.append('merge_request[target_branch]', targetBranch);

  fetch('merge_requests', {
    method: 'POST',
    body: formData,
  }).then((res) => {
    location.href = res.url + '/diffs';
  });
}

if (/\/branches$/.test(location.pathname)) {
  const allBranches = document.querySelector('.all-branches');
  const refNameList = allBranches.querySelectorAll('.ref-name');
  function isExist(branchName) {
    return Boolean(Array.from(refNameList).find(refName => {
      return refName.textContent.trim() === branchName;
    }));
  }

  const date = new Date();
  const dateString = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const navControls = document.querySelector('.nav-controls');

  function appendNewButton(type) {
    const button = document.createElement('a');
    button.setAttribute('class', 'btn btn-create');
    button.textContent = `New ${type.replace(/^\w/, c => c.toUpperCase())}`;
    const branchName = `${type}/${dateString}`;
    if (isExist(branchName)) {
      button.setAttribute('disabled', '');
      const branchElement = document.querySelector(`.js-branch-${branchName.replace('/', '\\/')}`);
      branchElement.style.backgroundColor = 'antiquewhite';
    } else {
      button.addEventListener('click', () => {
        createNewBranch(branchName);
        button.setAttribute('disabled', '');
        button.insertBefore(iconLoading, button.firstChild);
      });
    }
    navControls.appendChild(button);
  }

  appendNewButton('bus');
  appendNewButton('merge');

  const branchListItem = allBranches.querySelectorAll('li');
  Array.from(branchListItem).forEach(item => {
    if (/js-branch/.test(item.className) && item.className !== 'js-branch-master') {
      const controls = item.querySelector('.controls');
      function appendControlButton(type) {
        const button = document.createElement('a');
        button.setAttribute('class', 'btn btn-default');
        button.textContent = `Merge to ${type}`;
        button.style.boxShadow = '0 0 8px antiquewhite';
        const sourceBranch = item.className.replace(/^js-branch-/, '');
        const targetBranch = `${type}/${dateString}`;
        if (isExist(targetBranch)) {
          if (sourceBranch === targetBranch) {
            button.style.visibility = 'hidden';
          }
          controls.insertBefore(button, controls.children[0]);
        }
        button.addEventListener('click', () => {
          createMergeRequest(sourceBranch, targetBranch);
          button.setAttribute('disabled', '');
          button.insertBefore(iconLoading, button.firstChild);
        });
      }
      appendControlButton('merge');
      appendControlButton('bus');
    }
  });
}

function http2https() {
  const aList = Array.from(document.querySelector('.js-dropdown-menu-projects').querySelectorAll('a'));
  if (aList.length) {
    aList.forEach(a => {
      if (/^http:/.test(a.href)) {
        a.href = a.href.replace('http:', 'https:');
      }
    });
  } else {
    setTimeout(() => {
      http2https();
    }, 500);
  }
}

document.querySelector('.js-projects-dropdown-toggle').addEventListener('click', () => {
  http2https();
});

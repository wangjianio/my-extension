function createNewBranch(branchName, ref = 'master') {
  const formData = new FormData();
  formData.append('utf8', '1');
  formData.append('authenticity_token', 'gCjAU7PfXBv6RC4K8luTBeaEleIIo6fSx+PhWj1mtIsYgJF4dnkzOC+Ssk4fLrr5U7Dt/u5oz5SJOZvDejXgPg==');
  formData.append('branch_name', branchName);
  formData.append('ref', ref);
  fetch('branches', {
    method: 'POST',
    body: formData,
  }).then(() => {
    location.reload();
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

  // const branchListItem = allBranches.querySelectorAll('li');
  // Array.from(branchListItem).forEach(item => {
  //   if (/js-/.test(item.className)) {
  //     const controls = item.querySelector('.controls');
  //     function appendControlButton(type) {
  //       const button = document.createElement('a');
  //       button.setAttribute('class', 'btn btn-default');
  //       button.textContent = `Merge to ${type}`;
  //       controls.insertBefore(button, controls.children[0]);
  //     }
  //     appendControlButton('merge');
  //     appendControlButton('bus');
  //   }
  // });

  const dateString = new Date().toLocaleDateString().replace(/\//g, '');
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
      });
    }
    navControls.appendChild(button);
  }

  appendNewButton('bus');
  appendNewButton('merge');
}

/**
 * gitlab project 后面加 branches 超链接
 */
const projectDetails = document.getElementsByClassName('project-details');

for (let index = 0; index < projectDetails.length; index++) {
  const projectDetail = projectDetails[index];

  const h3 = projectDetail.querySelector('h3');
  const project = h3.querySelector('.project');

  project.textContent = project.textContent.replace(/\s/g, '').replace('/', ' / ');

  const slash = document.createElement('span');
  slash.textContent = ' / ';

  const branches = document.createElement('a');
  branches.href = project.href + '/branches?sort=updated_desc';
  branches.textContent = 'branches';

  h3.appendChild(slash);
  h3.appendChild(branches);
}
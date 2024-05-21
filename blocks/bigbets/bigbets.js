import {
  fetchSearch,
  CATEGORY_BIGBETS,
} from '../../scripts/scripts.js';

import {
  getTagList,
} from '../../scripts/utils.js';

const getListHTML = (row) => `
<div class="bb-image"><img src="${row.image}" alt="${row.title}"/></div>
<div class="bb-content">
  <h3>${row.title}</h3>
  <p class="bb-description">${row.description}</p>
  <div class="bb-meta">
    <div class="visibility"><img src="https://main--aem-competency--aem-comp.hlx.live/assets/users/media_15e8d069f911ce3c77611de6ae5818e6445deaf30.png" /> ${row.visibility}</div>
    <div class="owner">Owner: <img src="https://main--aem-competency--aem-comp.hlx.live/assets/users/media_15e8d069f911ce3c77611de6ae5818e6445deaf30.png"/ > <strong>${row.author}</strong></div>
    <div class="status">Status: <strong>${row.status}</strong></div>
  </div>`;

const getButtonHTML = (row) => `<a href="${row.path}" class="button" title="${row.title}">Join</a>`;

async function printList(list) {
  let printCount = 0;
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('bb-container');

  const randomList = list.sort(() => 0.5 - Math.random());

  randomList.every((row) => {
    if (printCount > 2) {
      return false;
    }
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('bb-card');

    cardDiv.innerHTML = getListHTML(row);

    if (row.tags) {
      cardDiv.append(getTagList(row.tags, 'bb'));
    }
    cardDiv.insertAdjacentHTML('beforeend', getButtonHTML(row));

    containerDiv.append(cardDiv);
    printCount += 1;

    return true;
  });

  return containerDiv;
}

export default async function decorate(block) {
  const list = await fetchSearch(CATEGORY_BIGBETS);
  block.textContent = '';

  const objects = await printList(list);
  block.append(objects);
}

import {
  fetchPlaceholders, createOptimizedPicture, readBlockConfig,
} from '../../scripts/aem.js';
import { fetchSearch, CATEGORY_BIGBETS } from '../../scripts/scripts.js';
import { getTagList, getAuthorImage } from '../../scripts/utils.js';

const getListHTML = (row) => `
<div class="bb-content">
  <h3>${row.title}</h3>
  <p class="bb-description">${row.description}</p>
  </div>`;

const getButtonHTML = (row, joinLabel) => `<p class='button-container'><a href="${row.path}" class="button primary" title="${row.title}">${joinLabel}</a><p>`;
const metaVisibilityHTML = (row) => `<div class="icon-container"><span class="icon icon-globe"><img data-icon-name="globe" src="/icons/globe.svg" alt="" loading="lazy"></span> ${row.visibility}</div>`;
const metaStatusHTML = (row) => `<div class="status">Status:&nbsp;<strong> ${row.status}</strong></div>`;
const metaAuthorImgHTML = (row, authorImg) => `<div class="owner">Owner: <img src="${authorImg}" title="${row.author}" width="24" height="24" /> <strong>${row.author}</strong></div>`;
const metaAuthorHTML = (row) => `<div class="owner">Owner:&nbsp;<strong> ${row.author}</strong></div>`;
//const viewAllLinkHTML = (config) => `<a href="${config.viewAllLink}" title="${config.viewAllLabel}" class="button secondary">${config.viewAllLabel}</a>`;
const viewAllLinkHTML = (config, viewAllLink) => `<a href="${viewAllLink}" title="${config.viewAllLabel}" class="button secondary">${config.viewAllLabel}</a>`;

let nextPage = 0;

function createCardImage(src, alt, config) {
  const cardImg = document.createElement('div');
  cardImg.className = 'bb-image';
  if (config.type === 'teaser-view') {
    cardImg.append(createOptimizedPicture(src, alt));
  } else {
    cardImg.append(createOptimizedPicture(src, alt, true));
  }
  cardImg.querySelector('img').width = 600;
  cardImg.querySelector('img').height = 300;

  return cardImg;
}

async function printList(list, placeholder, config, page) {
  let printCount = 0;
  let updatedList;
  let cardCount = 3;
  const randomList = list.sort(() => 0.5 - Math.random());

  const totalItems = list.length;
  const remain = totalItems - 2;
  let i = 0;
  let j = 0;
  const itemsPerPage = 2;
  let exitLoop = false;
  //const page = 3;
  let offset = (page - 1) * itemsPerPage + 1.
  

  let start = (page - 1) * itemsPerPage + 1
  let end = totalItems

  if (itemsPerPage < totalItems) {
    end = itemsPerPage * page
    if (end > totalItems) {
      end = totalItems;
    }
  }

  if (end < totalItems) {
    nextPage = parseInt(page) + 1;
   
  } else {
    nextPage = -1;
  }

  if (config.type === 'list-view') {
    updatedList = randomList;
    cardCount = end;
  } else {
    updatedList = list;
  }

  const containerDiv = document.createElement('div');
  //containerDiv.classList.add('bb-container');
  containerDiv.className = `bb-container ${config.type}`;

  updatedList.every((row) => {
    if (printCount > (cardCount - 1)) {
      return false;
    }
    const cardDiv = document.createElement('div');
    //cardDiv.classList.add('bb-card ${config.type}');

    cardDiv.className = `bb-card ${config.type}`;
    
    cardDiv.append(createCardImage(row.image, row.title, config));
    cardDiv.insertAdjacentHTML('beforeend', getListHTML(row));

    const metaContainer = document.createElement('div');
    const authorImg = getAuthorImage(row.author, placeholder);

    metaContainer.className = 'big-bet-meta';
    metaContainer.insertAdjacentHTML('beforeend', metaVisibilityHTML(row));

    if (authorImg) {
      metaContainer.insertAdjacentHTML('beforeend', metaAuthorImgHTML(row, authorImg));
    } else {
      metaContainer.insertAdjacentHTML('beforeend', metaAuthorHTML(row, authorImg));
    }

    metaContainer.insertAdjacentHTML('beforeend', metaStatusHTML(row));
    cardDiv.querySelector('.bb-content').insertAdjacentElement('beforeend', metaContainer);

    if (row.tags) {
      cardDiv.querySelector('.bb-content').append(getTagList(row.tags, 'bb'));
    }

    cardDiv.querySelector('.bb-content').insertAdjacentHTML('beforeend', getButtonHTML(row, config.cardCTALabel));
    containerDiv.append(cardDiv);
    printCount += 1;

    return true;
  });

  return containerDiv;
}

function getConfig(block, placeholder) {
  const config = {};
  const blockConfig = readBlockConfig(block);

  config.type = blockConfig.type || 'teaser-view';
  config.cardCTALabel = placeholder.bigbetCtaLabel || 'Join me';
  config.viewAllLabel = blockConfig.viewalllabel || placeholder.bigbetViewall || 'View all 1';
  config.viewAllLink = blockConfig.viewalllink || '/';
  if (config.type === 'full-view') {
    config.viewAllLink = '#';
  }
  return config;
}

export default async function decorate(block) {
  const placeholder = await fetchPlaceholders();
  const config = getConfig(block, placeholder);

  const urlParams = new URLSearchParams(window.location.search);
  const pageParam = urlParams.get('page');
  const page = pageParam > 0 ? pageParam : 1; // with parameter, weight is 1. Defaults to 100.

  block.textContent = '';
  const list = await fetchSearch(CATEGORY_BIGBETS);

  const objects = await printList(list, placeholder, config, page);
  block.append(objects);

  const viewAllContainer = document.createElement('div');
  viewAllContainer.className = `view-all ${config.type}`;

  //"?page="
  let viewAllLink = '';
  if (config.type === 'list-view') {
    if (nextPage > 0) {
      viewAllLink = "?page=" + nextPage;
    } else {
      viewAllLink = "#";
    }
    viewAllContainer.innerHTML = viewAllLinkHTML(config,viewAllLink);
  } else {
    viewAllLink = config.viewalllink;
    viewAllContainer.innerHTML = viewAllLinkHTML(config, viewAllLink);
  }
  block.append(viewAllContainer);
}

import { readBlockConfig, fetchPlaceholders } from '../../scripts/aem.js';
import { getAuthorImage } from '../../scripts/utils.js';
import { fetchSearch, CATEGORY_BIGBETS } from '../../scripts/scripts.js';

const OWNER = 'owner';
const TAG_COUNT = 5;
const leadBoardHTML = (author, authorImg) => `<div class="lb-user-img"><img src="${authorImg}" alt="${author}" width="72" height="72"><strong>${author}</strong></div>`;
const teamMemberImgHTML = (author, authorImg) => `<div class="team-user-img"><img src="${authorImg}" alt="${author}" width="24" height="24">${author}</div>`;
const teamMemberHTML = (author) => `<div>${author}</div>`;

function generateTeamList(category, team, placeholder) {
  const users = team.split(',');
  const teamSize = users.length;
  const isOwner = category.startsWith(OWNER);

  const teamContainer = document.createElement('div');
  teamContainer.className = 'team-container';
  const teamHeading = document.createElement('h3');
  teamHeading.innerHTML = `${category.replace(/-/g, ' ')} (${teamSize})`;
  teamContainer.append(teamHeading);

  const teamList = (document.createElement('div'));
  teamList.className = 'team-list';

  users.forEach((user) => {
    const userImg = getAuthorImage(user.trim(), placeholder);
    if (isOwner && userImg) {
      teamList.insertAdjacentHTML('beforeend', teamMemberImgHTML(user, userImg));
    } else {
      teamList.insertAdjacentHTML('beforeend', teamMemberHTML(user));
    }
  });

  teamContainer.append(teamList);
  return teamContainer;
}

function generateLeadboardList(team, placeholder) {
  const users = team.split(',');
  const teamContainer = document.createElement('div');
  teamContainer.className = 'leadboard-container';

  users.forEach((user) => {
    const userImg = getAuthorImage(user.trim(), placeholder);
    if (userImg) {
      teamContainer.insertAdjacentHTML('beforeend', leadBoardHTML(user, userImg));
    }
  });

  return teamContainer;
}

async function generateTagList(block) {
  const bigBetsList = await fetchSearch(CATEGORY_BIGBETS);
  const tags = await bigBetsList.filter((item) => item.path === window.location.pathname);
  let tagListContainer = 'NA';
  if (tags && tags.length && tags[0].tags && tags[0].tags.length) {
    tagListContainer = document.createElement('ul');

    tagListContainer.className = 'tags white';
    tags[0].tags = JSON.parse(tags[0].tags);
    tags[0].tags.forEach((tag, index) => {
      const tagItem = document.createElement('li');
      tagItem.innerHTML = tag;
      tagListContainer.append(tagItem);
      if ((index + 1) > TAG_COUNT) {
        tagItem.className = 'view-more';
      }
    });

    if (tags[0].tags.length > TAG_COUNT) {
      // Create the input element
      const inputElement = document.createElement('input');
      inputElement.type = 'checkbox';
      inputElement.hidden = true;
      inputElement.className = 'view-more-state';
      inputElement.id = 'view-more';

      // Create the first label element
      const labelClosed = document.createElement('label');
      labelClosed.setAttribute('for', 'view-more');
      labelClosed.className = 'view-more-closed';
      labelClosed.innerText = 'View More';

      // Create the second label element
      const labelOpened = document.createElement('label');
      labelOpened.setAttribute('for', 'view-more');
      labelOpened.className = 'view-more-opened';
      labelOpened.innerText = 'View Less';
      block.append(inputElement, tagListContainer, labelClosed, labelOpened);
    } else {
      block.append(tagListContainer);
    }
  }
}

export default async function decorate(block) {
  const HEADING = 'heading';
  const blockConfig = readBlockConfig(block);
  const placeholder = await fetchPlaceholders();
  const isLeaderboard = block.classList.contains('leaderboard');
  const isTag = block.classList.contains('tag');

  block.innerHTML = '';
  Object.entries(blockConfig).map(async (entry) => {
    const key = entry[0]; const value = entry[1];
    if (key === HEADING) {
      const heading = document.createElement('h2');
      heading.innerHTML = value;
      block.append(heading);
    } else if (isLeaderboard) {
      block.append(generateLeadboardList(value, placeholder));
    } else {
      block.append(generateTeamList(key, value, placeholder));
    }
    if (isTag) {
      await generateTagList(block);
    }
    return block;
  });
}

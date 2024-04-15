import { createPictureTag } from '../../scripts/scripts.js';

const classNames = {
    banner: 'banner',
    bannerChild: 'bannerChild',
    teaserType: 'teaserType',
    teaserTitle: 'teaserTitle',
    description: 'description',
    dateTimeUser: 'dateTimeUser',
    date: 'date',
    time: 'time',
    user: 'user',
    button: 'button',
    buttonLink: 'buttonLink',
    buttonDescription: 'buttonDescription',
};

function getPictureElement(row) {
    const images = Array.from(row.querySelectorAll('img'));
    const [desktopImage, mobileImage] = images.map(({ src }) => src);
    const content = {
        desktop: desktopImage,
        mobile: mobileImage,
        alt: '',
        minWidth: 600,
    };
    return createPictureTag(content);
};

function createElementWithClass (tagName, className, innerHTML) {
    const element = document.createElement(tagName);
    element.classList.add(className);
    if (innerHTML) {
        element.innerHTML = innerHTML;
    }
    return element;
};

export default async function decorate(block) {
    Array.from(document.getElementsByClassName('banner-wrapper')).forEach(element => {
        const [image1, teaserType, teaserTitle, description, date, time, user, button, buttonDescr] = block.querySelectorAll(':scope div > div:nth-child(even)');
        const bannerImg = getPictureElement(image1);

        const Banner = document.createElement('div');
        Banner.classList.add(classNames.banner);

        Banner.append(bannerImg);
        const BannerChild = document.createElement('div');
        BannerChild.classList.add(classNames.bannerChild);

        const TeaserType = createElementWithClass('div', classNames.teaserType, teaserType.innerHTML);
        const TeaserTitle = createElementWithClass('div', classNames.teaserTitle, teaserTitle.innerHTML);
        const Description = createElementWithClass('div', classNames.description, description.innerHTML);

        const Data = document.createElement('div');
        Data.classList.add(classNames.dateTimeUser);

        if (date.innerHTML) {
            const Date = createElementWithClass('span', classNames.date, date.innerHTML);
            Data.append(Date);
        }

        if (time.innerHTML) {
            const Time = createElementWithClass('span', classNames.time, time.innerHTML);
            Data.append(Time);
        }

        if (user.innerHTML) {
            const User = createElementWithClass('span', classNames.user, user.innerHTML);
            Data.append(User);
        }

        const Button = createElementWithClass('div', classNames.button);
        const divElement = document.querySelector(".button-container");
        const anchorElement = divElement.querySelector("a");
        const aHref = anchorElement.getAttribute('href');
        const aText = anchorElement.textContent;
        const aElementTag = document.createElement('a');
        aElementTag.classList.add(classNames.buttonLink);
        aElementTag.setAttribute('href', aHref);
        aElementTag.setAttribute('title', aText);
        aElementTag.textContent = aText;
        Button.append(aElementTag);

        const ButtonDescription = createElementWithClass('div', classNames.buttonDescription, buttonDescr.innerHTML);

        [TeaserType, TeaserTitle, Description, Data, Button, ButtonDescription].forEach(element => {
            BannerChild.append(element);
        });

        Banner.append(BannerChild);

        block.innerHTML = '';
        block.append(Banner);
    });
}

export async function getGodDetails(url, page) {

    await page.goto(url);
    await page.waitForSelector('.footer__contents');

    const god = await page.$eval('.page-contents', root => {

        const icons = {
            ["icon-warrior"]: "\\e928",
            ["icon-mage"]: "\\e91b",
            ["icon-guardian"]: "\\e91d",
            ["icon-hunter"]: "\\e929",
            ["icon-assassin"]: "\\e927",
            ["icon-yoruba"]: "https://webcdn.hirezstudios.com/smite-media/wp-content/uploads/2019/06/yoruba-large-white.png",
            ["icon-greatoldones"]: "https://webcdn.hirezstudios.com/smite-media/wp-content/uploads/2020/06/great-one-large-white.png",
            ["icon-babylonian"]: "https://webcdn.hirezstudios.com/smite-media/wp-content/uploads/icon-babylonian-white-100x100.png",
            ["icon-arthurian"]: "https://webcdn.hirezstudios.com/smite-media/wp-content/uploads/2019/01/arthurian-icon-white-100x100.png",
            ["icon-greek"]: "\\e925",
            ["icon-hindu"]: "\\e922",
            ["icon-chinese"]: "\\e924",
            ["icon-egyptian"]: "\\e920",
            ["icon-celtic"]: "\\e91e",
            ["icon-japanese"]: "\\e91f",
            ["icon-maya"]: "\\e921",
            ["icon-norse"]: "\\e926",
            ["icon-polynesian"]: "\\e92d",
            ["icon-roman"]: "\\e923",
            ["icon-slavic"]: "\\e92b",
            ["icon-voodoo"]: "\\e92c",
            ["icon-melee"]: "\\e90f",
            ["icon-ranged"]: "\\e911",
            ["icon-physical"]: "\\e910",
            ["icon-magical"]: "\\e90e",
        };

        const getContent = el => el.textContent.trim();
        const getUrlFromBgImg = bgImg => bgImg.substring(5, bgImg.length - 2);
        const cssCodeToHtmlCode = (code) => {
            console.log(parseInt(code.substring(1, 5), 16));
            return `&#${parseInt(code.substring(1, 5), 16)}`;
        }
        const getIcon = className => {
            for (const key in icons) {
                if (key === className) return icons[key];
            }
        };

        const name = root.querySelector('h1');
        const title = name.nextSibling;
        const banner = root.querySelector('.profile__header');
        const bannerUrl = getUrlFromBgImg(banner.style["background-image"]);

        const specifications = [...root.querySelectorAll('.meta__single')]
            .map(spe => {

                const icon = getIcon(spe.firstChild.getAttribute('class'))
                return {
                    name: getContent(spe.lastChild),
                    [icon.length > 5 ? "iconUrl" : "iconHtml"]: icon.length > 5 ? icon : cssCodeToHtmlCode(icon)
                }
            });

        const abilitiesElement = root.querySelector('.core__abilities');

        const abilities = [...abilitiesElement.querySelectorAll('.single__ability')].map((singleAbility, index, arr) => {
            const ability = {
                video: abilitiesElement.querySelector('.abilities__video iframe').getAttribute('src'),
                image: abilitiesElement.querySelector('.single__ability.active img').getAttribute('src'),
                key: getContent(abilitiesElement.querySelector('.single__ability.active .ability__slot--key') ||
                    abilitiesElement.querySelector('.single__ability.active .ability__slot')),
                name: getContent(abilitiesElement.querySelector('.single__ability.active .ability__name')),
                description: {
                    text: getContent(abilitiesElement.querySelector('.abilities__description p')),
                    details: [...abilitiesElement.querySelectorAll('.details__single')]
                        .map(detail => getContent(detail))
                }
            };
            if (index + 1 < arr.length) arr[index + 1].click();
            return ability;
        });

        const history = {
            video: root.querySelector('.lore__video iframe').getAttribute('src'),
            text: getContent(root.querySelector('.lore__copy p'))
        };


        const skins = [...root.querySelectorAll('.single__skin')].map(skin => ({
            image: getUrlFromBgImg(skin.style["background-image"]),
            name: getContent(skin.querySelector('.skin__name')),
            type: getContent(skin.querySelector('.skin__type'))
        }));

        return {
            name: getContent(name),
            title: getContent(title),
            banner: bannerUrl,
            specifications,
            abilities,
            history,
            skins,
        };
    })

    return god;
}
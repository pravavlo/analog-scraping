const { error } = require('console');
const {chromium} = require('playwright');
const randomUseragent = require('random-useragent');

(async () => {
  const agent = randomUseragent.getRandom();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({userAgent : agent});
  const page = await browser.newPage({bypassCSP: true});

  await page.goto('https://www.analog.com/en/index.html');
  await page.click('//*[@id="header"]/div[2]/nav/ul/li[3]/a');
  await page.waitForSelector('.adi-mm__tab-content--expanded');
  
  const products = await page.$$eval('.adi-mm__products__categories-menu__list__category', elements => {
      return elements.map(element => {
          const textElement = element.querySelector('.adi-mm__products__categories-menu__list__category__link__name');
          const linkElement = element.querySelector('a');
          
          return {
              mpn: textElement ? textElement.innerHTML.trim() : null,
              link: linkElement ? linkElement.getAttribute('href') : null
          };
      });
  });
  
  console.log(JSON.stringify(products, null, 2));
  await browser.close();
})().catch(error => {
    console.log(error);
    process.exit(101);
});

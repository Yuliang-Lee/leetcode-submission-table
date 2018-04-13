const puppeteer = require('puppeteer');
const qs = require('qs')
const config = require('../config.json');

let browser, page;
let result = [];
let status = {
  finished: false
};

// init
(async function() {
  browser = await puppeteer.launch({
    headless: config.headless
  })
  page = await browser.newPage();
  await page.goto('https://leetcode.com/accounts/login/');

  await login(page);

  page.on('response', async response => {
    if (response.url().indexOf('https://leetcode.com/api/submissions/') !== -1) {
      const query = response.url().split('?').pop();
      const offset = qs.parse(query).offset !== '0' ? Math.floor(qs.parse(query).offset / 20) + 1 : 1;
      let subs = await response.text();
      subs = JSON.parse(subs)
      result = result.concat(subs.submissions_dump)

      if (subs.has_next) {
        await page.goto('https://leetcode.com/submissions/#/' + (offset + 1))
      } else {
        status.finished = true;
      }
    }
  })
})()

exports.getSubmissions = async () => {
  status.finished = false;
  result = [];

  // 进入submissions页面
  const resp = await page.goto('https://leetcode.com/submissions/', {
    waitUntil: 'domcontentloaded'
  })

  // relogin if login session expire
  if (resp.url().indexOf('https://leetcode.com/accounts/login') > -1) {
    await login(page);
    await page.goto('https://leetcode.com/submissions/')
  }

  await new Promise((resolve) => {
    setInterval(_ => {
      status.finished ? resolve() : '';
    }, 20)
  })

  // await browser.close();
  return result;
}

async function login(page) {
  console.log('logging...')
  // 登陆
  const nameInput = await page.$('#id_login')
  const pwdInput = await page.$('#id_password')
  const submitBtn = await page.$('.auth-action-btn')
  await nameInput.type(config.username)
  await pwdInput.type(config.password)
  await submitBtn.click()
  await page.waitForNavigation({
    waitUntil: 'domcontentloaded'
  })
  console.log('login success!')
  console.log('please visit http://127.0.0.1:3000')
}

// close browser
process.on('exit', async () => {
  await browser.close();
})
const puppeteer = require('puppeteer');
const qs = require('qs');
const chalk = require('chalk');
const opn = require('opn');
const ora = require('ora');
// const config = require('../config.json');

let browser, page;
let result = [];
let status = {
  finished: false
};

// init
exports.init = async function init(config) {
  browser = await puppeteer.launch({
    headless: config.headless
  });
  page = await browser.newPage();

  try {
    const spinner = ora('opening leetCode...').start();
    await page.goto('https://leetcode.com/accounts/login/');
    spinner.stopAndPersist();
  } catch (e) {
    console.log(chalk.red('Timeout Exceeded: 30000ms exceeded, can\'t visit leetCode.'));
    process.exit(1);
  }

  await login(page, config);

  page.on('response', async response => {
    if (response.url().indexOf('https://leetcode.com/api/submissions/') !== -1) {
      const query = response.url().split('?').pop();
      const offset = qs.parse(query).offset !== '0' ? Math.floor(qs.parse(query).offset / 20) + 1 : 1;
      let subs = await response.text();
      subs = JSON.parse(subs);
      result = result.concat(subs.submissions_dump);

      if (subs.has_next) {
        await page.goto('https://leetcode.com/submissions/#/' + (offset + 1));
      } else {
        status.finished = true;
      }
    }
  });
};

exports.getSubmissions = async () => {
  status.finished = false;
  result = [];

  // 进入submissions页面
  const resp = await page.goto('https://leetcode.com/submissions/', {
    waitUntil: 'domcontentloaded'
  });

  // relogin if login session expire
  if (resp.url().indexOf('https://leetcode.com/accounts/login') > -1) {
    await login(page);
    await page.goto('https://leetcode.com/submissions/');
  }

  await new Promise((resolve) => {
    let flag = setInterval(() => {
      if (status.finished) {
        resolve();
        clearInterval(flag);
      }
    }, 20);
  });

  // await browser.close();
  return result;
};

async function login(page, config) {
  const spinner = ora('logging...').start();
  const nameInput = await page.$('#id_login');
  const pwdInput = await page.$('#id_password');
  const submitBtn = await page.$('.auth-action-btn');

  await nameInput.type(config.username);
  await pwdInput.type(config.password);
  await submitBtn.click(); // 登陆

  try {
    const failOrSuccess = await Promise.race([
      page.waitForSelector('.input-feedback'), // 检测账号密码错误提示
      page.waitForNavigation({waitUntil: 'domcontentloaded'}) // 检测转跳行为
    ]);

    if (failOrSuccess.toString() === 'JSHandle@node') { // 账号密码错误时结果是一个 ElementHandle
      console.log(chalk.red('\ninvalid username or password!'));
      process.exit(0);
    }
  } catch(e) {
    console.log(chalk.red('Timeout Exceeded: 30000ms exceeded, can\'t visit leetCode.'));
    process.exit(1);
  }

  spinner.succeed('login success!');
  opn(`http://127.0.0.1:${config.port}`);
  console.log(`please visit http://127.0.0.1:${config.port}`);
}

// close browser
process.on('exit', async () => {
  await browser.close();
});
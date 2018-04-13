# leetCode submission table

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/Yuliang-Lee/vue2-smooth-scroll/blob/master/LICENSE)


> Use crawlers to get all submitted records, use tables to display, add filtering.

## Why?

leetCode's submissions history page does't offer filter function, it's very inconvenient if we want to find the one we had submit.

## Usage

### Deps

- Node 8+
- Can access google.com(你懂的)

### Install

```bash
# download project
~$ git clone git@github.com:Yuliang-Lee/leetcode-submission-table.git
~$ cd leetcode-submission-table
~/leetcode-submission-table $ npm install
```

### Config

open the root `config.json` file, input your leetCode username and pwd.

```json
{
  "username": "bidiu",
  "password": "biu~",
  "headless": false
}
```

### Start

```bash
~/leetcode-submission-table $ npm run start

# console will output
Server started. Please wait...
logging...
login success!
please visit http://127.0.0.1:3000
```


## Screenshot

![2](https://user-images.githubusercontent.com/6936358/38743224-201d3624-3f71-11e8-960e-4c05442367cd.gif)


## TODO

- support oAuth


## License

MIT
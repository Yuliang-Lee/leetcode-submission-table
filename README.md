# leetCode submission table

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/Yuliang-Lee/vue2-smooth-scroll/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/@xlaoyu/leetcode-submission-table.svg)](https://www.npmjs.com/package/@xlaoyu/leetcode-submission-table)


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
~$ npm install -g @xlaoyu/leetcode-submission-table
```

### Start

```bash
~ $ lst -u username -p password

# or

~ $ lst -c config.json

# console will output
✔ Server start successed!
✔ login success!
please visit http://127.0.0.1:3000
```

### Config

| name | short name | default | desc |
|:----:|:----:|:----:|:----:|
| username | u | - | leetcode's username |
| password | p | - | leetcode's pwd |
| port | t | 3000 | local server port |
| config | c | - | specify config file |
| headless | l | true | whether use headless mode |

`config file example`
```json
{
  "username": "bidiu",
  "password": "biu~",
  "port": "3000",
  "headless: true
}
```



## Screenshot

![2](https://user-images.githubusercontent.com/6936358/38743224-201d3624-3f71-11e8-960e-4c05442367cd.gif)


## TODO

- support oAuth


## License

MIT
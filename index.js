const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const views = require('koa-views');

const { getSubmissions } = require('./lib/crawler');

const app = new Koa();
const router = new Router();

// Must be used before any router is used
app.use(views(__dirname + '/statics', {
  map: {
    html: 'underscore'
  }
}));

router.get('/', async (ctx) => {
  await ctx.render('index')
})

router.get('/api/submissions', async (ctx) => {
  const result = {
    code: 200,
    data: null,
    msg: ''
  };
  try {
    result.data = await getSubmissions();
  } catch (e) {
    result.code = 500;
    result.msg = e.message;
    console.log(e)
  }
  ctx.body = result;
});

app.use(serve(__dirname + '/statics'));
app.use(router.routes()).use(router.allowedMethods());

// server start
app.listen(3000, () => {
  console.log('Server started. Please wait...');
});

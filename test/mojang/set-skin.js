const test = require('ava')
const nock = require('nock')
const setSkin = require('../../src/mojang/set-skin')

// API behavior observed 28.08.2017 by maccelerated
test('resolves when access token, profile, and URL are valid', async t => {
  nock('https://api.mojang.com', {
    reqheaders: {
      'authorization': 'Bearer goodaccesstoken',
      'content-type': 'application/x-www-form-urlencoded'
    }
  }).post(`/user/profile/7ddf32e17a6ac5ce04a8ecbf782ca509/skin`, 'model=&url=urlOfPNG')
    .reply(204)

  await setSkin('goodaccesstoken', '7ddf32e17a6ac5ce04a8ecbf782ca509', 'urlOfPNG')
})

// API behavior observed 28.08.2017 by maccelerated
test('Optionally sends slim skin type when selected', async t => {
  nock('https://api.mojang.com', {
    reqheaders: {
      'authorization': 'Bearer goodaccesstoken',
      'content-type': 'application/x-www-form-urlencoded'
    }
  }).post(`/user/profile/7ddf32e17a6ac5ce04a8ecbf782ca509/skin`, 'model=slim&url=urlOfPNG')
    .reply(204)

  await setSkin('goodaccesstoken', '7ddf32e17a6ac5ce04a8ecbf782ca509', 'urlOfPNG', true)
})

// API behavior observed 28.08.2017 by maccelerated
test('rejects when URL is bad', async t => {
  nock('https://api.mojang.com', {
    reqheaders: {
      'authorization': 'Bearer goodaccesstoken',
      'content-type': 'application/x-www-form-urlencoded'
    }
  }).post(`/user/profile/7ddf32e17a6ac5ce04a8ecbf782ca509/skin`, 'model=&url=badURL')
    .reply(400, {
      'error': 'IllegalArgumentException',
      'errorMessage': 'Content is not an image'
    })

  await t.throws(setSkin('goodaccesstoken', '7ddf32e17a6ac5ce04a8ecbf782ca509', 'badURL'))
})

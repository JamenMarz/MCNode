const test = require('ava')
const nock = require('nock')
const {refresh} = require('../..')

test('returns a new access and client token', async t => {
  // Behavior observed 17.08.2017 by maccelerated
  nock('https://authserver.mojang.com')
    .post('/refresh', {
      accessToken: 'oldvalid',
      clientToken: 'client',
      selectedProfile: null,
      requestUser: true
    })
    .reply(200, {
      accessToken: 'newvalid',
      clientToken: 'client',
      selectedProfile: {
        id: 'profile identifier',
        name: 'player name'
      },
      user: {
        id: 'user identifier',
        properties: []
      }
    })

  const nextSession = await refresh('oldvalid', 'client', null, true)
  t.is(nextSession.accessToken, 'newvalid')
  t.is(nextSession.clientToken, 'client')
  t.truthy(nextSession.selectedProfile)
  t.truthy(nextSession.user)
})

test('rejects with invalid tokens', async t => {
  // Behavior observed 17.08.2017 by maccelerated
  nock('https://authserver.mojang.com')
    .post('/refresh', {
      accessToken: 'invalid',
      clientToken: 'client'
    })
    .reply(403, {
      error: 'ForbiddenOperationException',
      errorMessage: 'Invalid token'
    })

  const err = await t.throws(refresh('invalid', 'client', null, true))
  t.is(err.message, 'Invalid token')
  t.is(err.name, 'ForbiddenOperationException')
  t.is(err.statusCode, 403)
})

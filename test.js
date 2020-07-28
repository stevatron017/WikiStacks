const assert = require('assert')

describe('Check version of node', function () {
  it('Should test version assert', async function () {
    var version = process.version
    var check = parseFloat(version.substr(1, version.length)) > 12.0
    console.log('version: ' + version)
    console.log('check: ' + check)
    assert.equal(check, true)
  })
})

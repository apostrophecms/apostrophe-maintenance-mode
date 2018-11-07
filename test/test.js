const assert = require('assert');
const request = require('request-promise');

describe('apostrophe-maintenance-mode', function() {

  let apos;

  this.timeout(5000);

  after(function(done) {
    require('apostrophe/test-lib/util').destroy(apos, done);
  });

  it('should be a property of the apos object', function(done) {
    apos = require('apostrophe')({
      testModule: true,
      baseUrl: 'http://localhost:7780',
      modules: {
        'apostrophe-express': {
          port: 7780
        },
        'apostrophe-maintenance-mode': {}
      },
      afterInit: function(callback) {
        assert(apos.modules['apostrophe-maintenance-mode']);
        return callback(null);
      },
      afterListen: function(err) {
        assert(!err);
        done();
      }
    });
  });

  it('fetch homepage normally', async function() {
    const home = await request('http://localhost:7780/');
    assert(home);
    assert(home.match(/Home Page OK/));
  });

  it('enter maintenance mode', async function() {
    const req = apos.tasks.getReq();
    const g = await apos.global.find(req, {}).toObject();
    assert(g);
    g.maintenanceMode = true;
    await apos.global.update(req, g);
  });

  it('get appropriate result for homepage', async function() {
    try {
      assert(!(await request('http://localhost:7780/')));
    } catch (e) {
      assert(e.statusCode === 503);
    }
  });

  it('get appropriate result for login page', async function() {
    try {
      assert(await request('http://localhost:7780/login'));
    } catch (e) {
      assert(!e);
    }
  });

});

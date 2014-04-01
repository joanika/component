
/**
 * Module dependencies.
 */

var exec = require('child_process').exec
  , bin = __dirname + '/../bin/component'
  , path = require('path')
  , fs = require('fs')
  , vm = require('vm')

describe('component build', function(){
  it('should build', function(done){
    exec('cd test/fixtures/path && ' + bin + '-build', function(err, stdout){
      if (err) return done(err);
      console.log(stdout)
      stdout.should.include('build/build.js');
      stdout.should.include('duration');
      stdout.should.include('css');
      stdout.should.include('js');

      var js = fs.readFileSync('test/fixtures/path/build/build.js', 'utf8');
      var ret = vm.runInNewContext(js + '; require("foo")');
      ret.should.equal('baz');

      var ret = vm.runInNewContext(js + '; require("baz")');
      ret.should.equal('baz');

      done();
    })
  })

  it('should exclude the js file if no scripts, and the css file if no styles', function(done){
    exec('cd test/fixtures/no-js-css && ' + bin + '-build', function(err, stdout){
      if (err) return done(err);
      stdout.should.not.include('js :');
      stdout.should.not.include('css :');
      done();
    });
  });
})

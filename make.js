var b = require('substance-bundler');
var fs = require('fs')
var config = require('config')

var DIST = 'dist/'

// b.task('clean', function() {
//   b.rm('./dist')
// })

// copy assets
// b.task('assets', function() {
//   b.copy('node_modules/font-awesome', './dist/font-awesome')
// })

// function buildApp(app, core) {
//   return function() {
//     if(core) {
//       _archvistJS()
//       b.css('./node_modules/substance/dist/substance-pagestyle.css', 'dist/archivist/archivist-pagestyle.css', {variables: true})
//       b.css('./node_modules/substance/dist/substance-reset.css', 'dist/archivist/archivist-reset.css', {variables: true})
//     }
//     b.copy('client/'+app+'/index.html', './dist/'+app+'/')
//     b.copy('client/'+app+'/assets', './dist/'+app+'/assets/')
//     b.css('./client/' + app + '/app.css', 'dist/' + app + '/' + app + '.css', {variables: true})
//     b.js('client/' + app + '/app.js', {
//       // need buble if we want to minify later
//       buble: true,
//       external: ['substance'],
//       commonjs: { include: ['node_modules/lodash/**', 'node_modules/moment/moment.js', 'node_modules/plyr/src/js/plyr.js'] },
//       dest: './dist/' + app + '/app.js',
//       format: 'umd',
//       moduleName: app
//     })
//     b.custom('injecting config', {
//       src: './dist/' + app + '/app.js',
//       dest: './dist/' + app + '/' + app + '.js',
//       execute: function(file) {
//         const code = fs.readFileSync(file[0], 'utf8')
//         const result = code.replace(/ARCHIVISTCONFIG/g, JSON.stringify(config.get('app')))
//         fs.writeFileSync(this.outputs[0], result, 'utf8')
//       }      
//     })
//     b.copy('./dist/' + app + '/app.js.map', './dist/' + app + '/' + app + '.js.map')
//     b.rm('./dist/' + app + '/app.js')
//     b.rm('./dist/' + app + '/app.js.map')
//   }
// }

function _substanceJS(DEST, external) {
  var path = './node_modules/'
  if(external) path = '../'
  b.make('substance', 'clean', 'browser', 'server')
  b.copy(path + 'substance/dist', DEST)
}

function _buildServerArchivistJS(DEST) {
  b.js('./server.es.js', {
    buble: true,
    commonjs: true,
    external: ['substance', 'moment', 'massive', 'bluebird', 'password-generator', 'bcryptjs', 'args-js'],
    targets: [{
      dest: DEST + 'archivist.cjs.js',
      format: 'cjs', 
      sourceMapRoot: __dirname, 
      sourceMapPrefix: 'archivist'
    }]
  })
}

function _buildBrowserArchivist(DEST) {
  b.js('./index.es.js', {
    buble: true,
    external: ['substance', 'momemnt'],
    targets: [{
      useStrict: false,
      dest: DEST + 'archivist.js',
      format: 'umd', moduleName: 'archivist', sourceMapRoot: __dirname, sourceMapPrefix: 'archivist'
    }]
  })
}

function _buildDist(DEST, external) {
  var path = './node_modules/'
  if(external) path = '../'
  // Bundle Substance and Archivist
  _substanceJS(DEST+'substance', external)
  _buildServerArchivistJS(DEST)
  _buildBrowserArchivist(DEST)
  // Bundle CSS
  b.css('archivist.css', DEST+'archivist.css', {variables: true})
  b.css(path + 'substance/dist/substance-pagestyle.css', DIST+'archivist-pagestyle.css', {variables: true})
  b.css(path + 'substance/dist/substance-reset.css', DIST+'archivist-reset.css', {variables: true})

  // Copy assets
  //_distCopyAssets(DIST)
}

b.task('dev', function() {
  b.rm(DIST)
  _buildDist(DIST)
})

b.task('build', function() {
  b.rm(DIST)
  _buildDist(DIST, true)
})

b.task('default', ['dev'])

// b.task('publisher', ['clean', 'substance', 'assets'], buildApp('publisher', true))
// b.task('scholar', buildApp('scholar'))

// b.task('client', ['publisher', 'scholar'])

// // build all
// b.task('default', ['client'])

// // starts a server when CLI argument '-s' is set
// b.setServerPort(5001)
// b.serve({
//   static: true, route: '/', folder: 'dist'
// });
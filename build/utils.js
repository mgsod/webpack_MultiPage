var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
const pkg = require('../package.json')
// glob是webpack安装时依赖的一个第三方模块，还模块允许你使用 *等符号
// 例如lib/*.js就是获取lib文件夹下的所有js后缀名的文件
const glob = require('glob');
// 页面模版文件路径
const page_path = path.join(__dirname, '../src/module');
// 页面模板插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 融合相应的配置
const merge = require('webpack-merge');

const fileNameMap = {
  'carProfit': '测算车价利润',
  'financeProfit': '测算金融产品利润',
  'insurance': '选择险种',
  'insuranceProfit': '测算保险利润',
}

exports.assetsPath = function(_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production' ?
    config.build.assetsSubDirectory :
    config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function(options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

exports.createNotifierCallback = function() {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') {
      return
    }
    const error = errors[0]

    const filename = error.file && error.file.split('!')
      .pop()
    notifier.notify({
      title: pkg.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

// 多页面入口文件配置
// 通过glob模块读取module文件夹下的所有对应文件夹下的js后缀文件，如果该文件存在
// 那么就作为入口文件之一
exports.entry = _ => {
  var entryFiles = glob.sync(page_path + '/*/*.js');
  var map = {};
  entryFiles.map(filePath => {
    let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    map[filename] = filePath;
  });
  return map;
}

// 多页面输出配置
// 与上面的多页面入口文件配置相同，读取module文件夹下的对应的html后缀文件，然后放入数组中
exports.HtmlWebpackPlugin = _ => {
  // var entryFiles = glob.sync(page_path + '/*/*.html');
  var entryFiles = glob.sync(page_path + '/*/*.js');
  var arr = [];
  entryFiles.map(filePath => {
    let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    let config = {
      title: fileNameMap[filename],
      // 模板来源
      // template: filePath,
      template: path.join(__dirname, '../index.html'),
      // 文件名称
      filename: filename + '.html',
      inject: true,
      // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
      chunks: ['manifest', 'vendor', filename]
    }
    // 生产环境加入新配置,该配置是原webpack.prod.conf.js中相对于webpack.dev.conf.js新增配置
    if (process.env.NODE_ENV === 'production') {
      config = merge(config, {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
      })
    }
    arr.push(new HtmlWebpackPlugin(config));
  });
  return arr;
}

var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
    process.exit(1)
}

var server = http.createServer(function(request, response) {
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = request.method
        /******** 从这里开始看，上面不要看 ************/

    console.log('有个傻子发请求过来啦！路径（带查询参数）为：' + pathWithQuery)

    response.statusCode = 200

    //默认首页
    const filePath = path === '/' ? '/index.html' : path;
    console.log(filePath);
    // 返回.的索引
    const index = filePath.lastIndexOf('.');
    // 返回.和后面的所有字符，即后缀
    const suffix = filePath.substring(index);
    console.log(suffix);
    const fileTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.png': 'image/png'
        }
        // 如果后缀存在，返回对应的文档类型，不存在默认text/html
    response.setHeader('Content-Type', `${fileTypes[suffix]||'text/html'};charset=utf-8`)

    let content;
    // 当前try语句出错时，不会报错，而是执行下面的catch语句，error是自动传入的参数
    try {
        content = fs.readFileSync(`./public${filePath}`)
    } catch (error) {
        // 入过try语句出错，就说明没有读到文件，就让content=‘文件不存在’，写入响应体里面
        // 这样即使访问的路径不存在，也有处理办法，不至于导致服务器崩溃
        content = '文件不存在';
        // 设置响应状态码为404
        response.statusCode = 404;
    }
    response.write(content)
    response.end()

    /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)
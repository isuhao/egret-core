/**
 * Created by yanjiaqi on 15/9/16.
 */
/// <reference path="../lib/types.d.ts" />
var file = require('../lib/FileUtil');
var utils = require('../lib/utils');
var APITestTool = require('../actions/APITest');
var APItestCommand = (function () {
    function APItestCommand() {
        this.isAsync = true; //APITestTool是一个异步Action必须配置异步环境 很重要
    }
    APItestCommand.prototype.execute = function () {
        var self = this;
        this.projectPath = egret.args.projectDir;
        new APITestTool().execute(this.projectPath, onAPICallBack);
        //this.apiTest(projectPath);
        return DontExitCode;
        function onAPICallBack(error, total, logger) {
            if (error) {
                globals.exit(1705);
            }
            else {
                if (total != 0) {
                    //打开项目目录(异步方法)
                    utils.open(self.projectPath, function (err, stdout, stderr) {
                        if (err) {
                            console.log(stderr);
                        }
                        //延时操作下一步
                        setTimeout(function () {
                            //写入html并打开网址
                            if (logger._htmlBody != '') {
                                var saveContent = logger.htmlOut(
                                //为模版html注入属性值
                                { 'dir': self.projectPath,
                                    'version_old': egret.args.properties.getVersion(),
                                    'version_new': "2.5.0",
                                    'conflict_count': logger.total + '',
                                    'title': 'API检测报告',
                                    'dir_changed_tip': '',
                                    'qq_new_feature': '<strong>' + utils.ti(1713) + '</strong>',
                                    'color_red': '',
                                    'color_green': '',
                                    'color_normal': ''
                                });
                                var saveLogFilePath = file.joinPath(self.projectPath, 'LOG_APITEST.html');
                                self.saveFileAndOpen(saveLogFilePath, saveContent);
                                globals.exit(1712, saveLogFilePath); //检测结果已写入
                            }
                            //sumUpAndEndProcess();
                        }, 200);
                    });
                }
                else {
                    globals.exit(1702);
                }
            }
        }
    };
    APItestCommand.prototype.saveFileAndOpen = function (filePath, content) {
        file.save(filePath, content);
        utils.open(filePath);
    };
    return APItestCommand;
})();
module.exports = APItestCommand;

//# sourceMappingURL=../commands/apitest.js.map
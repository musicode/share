/**
 * @file 可定制的分享组件
 * @author musicode
 */
$(function () {

    /**
     * ## 平台配置
     *
     * 不同平台需要不同的分享文本，比如微博需要 @ 但其他平台不需要，图片同样也有类似需求
     *
     * ## 多对一配置
     *
     * 如果每个平台都需要单独配置，会出现很多冗余，比如 renren 和 tieba 使用相同的配置，
     * 最好的方式是多个平台使用同一份配置
     *
     * 多对一的方式如下：
     *
     * {
     *     config: {
     *         name1: { },
     *         name2: { }
     *     },
     *     renren: 'name1',
     *     tieba: 'name2'
     * }
     *
     * ## 一个页面多个分享组件
     *
     * 假设页面有两个分享组件，全局变量 shareConfig 配置如下：
     *
     * {
     *     name1: { },
     *     name2: { }
     * }
     *
     * 然后在组件元素分别加上 data-share="name1" 和 data-share="name2"
     *
     * ## 自定义
     *
     * 对于非跳转的分享，比如微信，对外暴露接口，可自行实现
     *
     * {
     *     custom: {
     *         weixin: function (url) {
     *             // 显示二维码
     *         }
     *     }
     * }
     */

    /**
     * 全局变量名
     *
     * @inner
     * @type {string}
     */
    var globalVar = 'shareConfig';

    /**
     * 分享组件选择器
     *
     * @inner
     * @type {string}
     */
    var shareSelector = '.share';

    /**
     * icon 选择器
     *
     * @inner
     * @type {string}
     */
    var iconSelector = '.share-icon';

    /**
     * 各个平台的配置
     *
     * @inner
     * @type {Object}
     */
    var platform = {
        tsina: {
            url: 'http://service.weibo.com/share/share.php',
            data: {
                url: 'url',
                title: 'title',
                appkey: 'appkey',
                img: 'pic'
            },
            extra: {
                searchPic: 'false'
            }
        },
        qzone: {
            url: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey',
            data: {
                url: 'url',
                title: 'title',
                content: 'desc',
                img: 'pics'
            }
        },
        tqq: {
            url: 'http://share.v.t.qq.com/index.php',
            data: {
                url: 'url',
                title: 'title',
                img: 'pic'
            },
            extra: {
                c: 'share',
                a: 'index'
            }
        },
        renren: {
            url: 'http://widget.renren.com/dialog/share',
            data: {
                url: 'resourceUrl',
                title: 'title',
                content: 'description',
                img: 'pic'
            }
        },
        tieba: {
            url: 'http://tieba.baidu.com/f/commit/share/openShareApi',
            data: {
                url: 'url',
                title: 'title',
                content: 'desc',
                img: 'pic'
            }
        },
        douban: {
            url: 'http://www.douban.com/share/service',
            data: {
                url: 'href',
                title: 'name',
                content: 'text',
                img: 'image'
            }
        }
    };

    var globalConf = window[globalVar];

    // 自定义配置
    var custom = globalConf.custom || {};

    $(shareSelector).each(
        function () {

            var element = $(this);
            var confName = element.data('share');
            var confData = globalConf[confName];

            element.on('click', iconSelector, function (e) {

                var name = $(this).data('name');
                var data = confData[name];

                if ($.type(data) === 'string') {
                    data = $.extend({}, confData.config[data]);
                }

                if (!data.url) {
                    data.url = document.URL;
                }

                if ($.isFunction(custom[name])) {
                    custom[name](data);
                }
                else {
                    var query = {};
                    var conf = platform[name];

                    $.each(conf.data, function (key, value) {
                        if (data[key]) {
                            query[value] = data[key];
                        }
                    });

                    if (conf.extra) {
                        $.extend(query, conf.extra);
                    }

                    var url = conf.url + '?' + $.param(query);

                    window.open(url);
                }

            });

        }
    );

});



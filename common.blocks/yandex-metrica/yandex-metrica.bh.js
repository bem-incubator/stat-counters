'use strict';

module.exports = function (bh) {

    bh.match('yandex-metrica', function (ctx) {
        var params = ctx.json().params,
            scriptContent,
            noScriptContent,
            constructorName = 'Metrika',
            fileName = 'watch.js',
            callbacksName = 'yandex_metrika_callbacks';

        if(!params) {
            throw Error('Missing counter parameters object');
        }

        if(!params.id) {
            throw Error('Missing counter ID');
        }

        if(params.v2) {
            constructorName = 'Metrika2';
            fileName = 'tag.js';
            callbacksName = 'yandex_metrika_callbacks2';
        }

        scriptContent = [
            '(function (d, w, c) {',
            '    (w[c] = w[c] || []).push(function() {',
            '        try {',
            '            w.yaCounter' + params.id + ' = new Ya.' + constructorName + '(' + JSON.stringify(params) + ');',
            '        } catch(e) { }',
            '    });',
            '',
            '    var n = d.getElementsByTagName("script")[0],',
            '        s = d.createElement("script"),',
            '        f = function () { n.parentNode.insertBefore(s, n); };',
            '    s.type = "text/javascript";',
            '    s.async = true;',
            '    s.src = "https://mc.yandex.ru/metrika/' + fileName + '";',
            '',
            '    if (w.opera == "[object Opera]") {',
            '        d.addEventListener("DOMContentLoaded", f, false);',
            '    } else { f(); }',
            '})(document, window, "' + callbacksName + '");'
        ].join('\n');

        noScriptContent = {
            tag : 'div',
            content : {
                tag : 'img',
                attrs : {
                    src : '//mc.yandex.ru/watch/' + params.id,
                    style : 'position:absolute; left:-9999px;'
                }
            }
        };

        return [
            {
                tag : 'script',
                attrs : { nonce : ctx.json().nonce },
                content : scriptContent
            },
            {
                tag : 'noscript',
                content : noScriptContent
            }
        ];
    });

};

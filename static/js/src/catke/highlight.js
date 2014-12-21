/**
 * doc
 * @module catke/highlight
 * @author vfasky <vfasky@gmail.com>
 */
define('catke/highlight', ['jquery', 'highlight'], function($, hljs) {
    "use strict";

    var alias = {
        js: 'javascript',
        jscript: 'javascript',
        html: 'xml',
        htm: 'xml',
        coffee: 'coffeescript',
        'coffee-script': 'coffeescript',
        yml: 'yaml',
        pl: 'perl',
        ru: 'ruby',
        rb: 'ruby',
        csharp: 'cs'
    };

    return function($el) {
        var $code = $el.find('> code');
        var lang = ($code.attr('class') || '').replace('hljs ', '');
        var compiled;
        var str = $code.html();

        lang = String(lang).toLowerCase() || 'plain';

        if (alias[lang]) {
            lang = alias[lang];
        }

        if (hljs.getLanguage(lang)) {
            try {
                compiled = hljs.highlight(lang, str).value;
            } catch (e) {
                compiled = hljs.highlightAuto(str).value;
            }
        }
        else{
        	compiled = hljs.highlightAuto(str).value;
        }

        var lines = compiled.split('\n'),
            numbers = '',
            content = '',
            firstLine = 1;

        if(!lines[lines.length - 1]){
        	lines.pop();
        }

        $.each(lines, function(i, item) {
            numbers += '<div class="line">' + (i + firstLine) + '</div>';
            content += '<div class="line">' + item + '</div>';
        });

        var result = '<figure class="highlight' + (lang ? ' ' + lang : '') + '">';

        result += '<table><tr>' +
            '<td class="gutter"><pre>' + numbers + '</pre></td>' +
            '<td class="code"><pre>' + content + '</pre></td>' +
            '</tr></table>';
            
        result += '</figure>';

        $el.after(result).remove();
    };
});

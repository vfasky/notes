"use strict";

var assert = require('assert');
var model = require('../../app/model');


describe('model book note', function() {
    var user, book, note, _has;

    before(function(done) {
        user = new model.User({
            name: 'test',
            email: 'test@mail.com',
            active: true
        });

        user.save(done);
    });

    before(function(done) {
        book = new model.Book({
            _user: user.id
        });

        book.save(done);
    });


    before(function(done) {

        note = new model.Note({
            title: '亚马逊推出“出价”功能 砍价不再是个难事',
            content: '据《华尔街日报》网站报道，亚马逊今天宣布，在其网站上推出了一项新功能。\n\n' +
                '此功能名为“出价（Make an Offer）”，可以让消费者与卖家议价，' +
                '进一步以低于商品最初定价的价格购买商品，从而提升亚马逊网站上诸多收藏品、' +
                '艺术品以及其它独一无二的商品的销 量。这项功能将针对亚马逊网站上的大量商品。\n\n' +
                '这一“出价”功能允许卖家接受或拒绝买家对一些商品的报价，' +
                '例如当前标价为449美元的由美国橄榄球“西雅图海鹰”队四分卫鲁塞尔·威尔逊（Russell Wilson）' +
                '签名的毛织运动衫。与此同时，这项新功能还可以帮助卖家取消那些不具有竞争力价格的商品。' +
                '据亚马逊周二的声明表示，一旦有买家报出他们的价格之后，专家将有三天时间作出回应。\n\n' +
                '买家的报价都是私下进行，当然可能会面临卖家的提价。亚马逊公司表示，' +
                '目前约有15万件商品符合“出价”政策，包括一些漂亮的艺术品、体育收藏品以及钱币等，' +
                '尽管这一数量较多，但与亚马逊网站今天销售的数百万件商品相比，仍只是一小部分而已。\n\n' +
                '尽管这项新“出价”功能主要针对一些独特的商品，但毫无疑问，' +
                '该新功能将有助于更加全面地提升亚马逊的低价美誉。' +
                '亚马逊公司越来越依赖第三方销售，对此，行业内一些分析师认为，' +
                '第三方销售商品数量约占亚马逊网站单位总销量的40%以上。' +
                '亚马逊从外部销售商那儿提取分成，其分成标准就是这些商品的售价，' +
                '一般是按照售价的10%至15%抽取分成。\n\n' +
                '亚马逊之所以获得了现有的声誉，其部分原因就是——提供了比实体零售店商品更低价格的商品。\n\n' +
                '但是，在网络销售领域，亚马逊也面临着对手施加的巨大竞争压力。\n\n' +
                '据价格数据公司360pi和富国银行今年10月发布的一份调查报告显示，' +
                'Target和沃尔玛等两家零售公司各自网站上的商品价格分别比亚马逊网站上相同商品的价格低5%和10%。',
            _user: user._id,
            _book: book._id,
        });

        note.save(done);
    });

    it('note build and save keywords', function(done) {

        var keywords = note.buildKeywords();
        var words = Object.keys(keywords);

        assert.notEqual(0, words.length);

        note.saveKeywords(keywords)(function(err, has) {
            if (err) {
                return done(err);
            }
            assert.equal(has.length, words.length);

            _has = has;
            done();


        });
    });

    it('note find by 华尔街日报', function(done) {
        model.Note.findByKeyword('华尔街日报', user)(function(err, query) {
            if (err) {
                return done(err);
            }
            if (null === query) {
                return done('Note.findByKeyword Error');
            }
            query.exec(function(err, notes) {
                if (err) {
                    return done(err);
                }


                assert.notEqual(0, notes.length);

                done();
            });
        });
    });

    after(function() {
        _has.forEach(function(v) {
            v.keyword.remove();
            v.noteKeyword.remove();
        });
    });

    after(function(done) {
        note.remove(done);
    });

    after(function(done) {
        book.remove(done);
    });

    after(function(done) {
        user.remove(done);
    });
});

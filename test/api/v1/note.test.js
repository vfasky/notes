"use strict";

var request = require('supertest');
var app = require('../../../server');
var noteApp = request.agent(app.callback());
var util = require('../../../app/lib/util');
var model = require('../../../app/model');
var assert = require('assert');

describe('api note', function() {
    var user, roles = [],
        password, book, bookId, noteId;

    before(function(done) {
        var role = new model.Role({
            code: 'user',
            description: '用户'
        });

        role.save(function(err, role) {
            if (err) {
                return done(err);
            }
            roles.push(role);
            done();
        });
    });

    before(function(done) {
        util.bhash('123456')(function(err, has) {
            password = has;
            done();
        });
    });

    before(function(done) {
        user = new model.User({
            name: 'test',
            email: 'test@mail.com',
            active: true,
            password: password
        });

        user.setRoles(roles);
        user.save(done);
    });

    before(function(done) {
        book = new model.Book({
            _user: user._id
        });

        book.save(done);
    });

    it('user login', function(done) {
        noteApp.put('/api/v1/user')
            .send({
                email: 'test@mail.com',
                password: '123456'
            })
            .expect(/true/)
            .expect(200, done);
    });

    it('add books', function(done) {
        noteApp.post('/api/v1/book')
            .send({
                title: 'test1'
            })
            .expect(200, function(err, res) {
                if (err) {
                    return done(err);
                }
                var data = res.body;

                if (data.state !== true) {
                    return done(data.error);
                }

                assert.equal('test1', data.book.title);

                bookId = data.book._id;

                done();
            });
    });

    it('add note', function(done) {
        noteApp.post('/api/v1/note')
            .send({
                title: 'note title',
                content: 'note content',
                bookId: bookId
            })
            .expect(200, function(err, res) {
                if (err) {
                    return done(err);
                }
                var data = res.body;

                if (data.state !== true) {
                    return done(data.error);
                }

                assert.equal('note title', data.note.title);
                assert.equal('note content', data.note.content);

                noteId = data.note._id;

                done();
            });

    });

    it('edit note', function(done) {
        noteApp.put('/api/v1/note')
            .send({
                title: 'note title2',
                content: 'note content2',
                bookId: bookId,
                id: noteId
            })
            .expect(200, function(err, res) {
                if (err) {
                    return done(err);
                }
                var data = res.body;

                if (data.state !== true) {
                    return done(data.error);
                }

                assert.equal('note title2', data.note.title);
                assert.equal('note content2', data.note.content);

                done();
            });

    });

    it('del note', function(done) {
        noteApp.del('/api/v1/note')
            .send({
                id: noteId
            })
            .expect(/true/)
            .expect(200, done);
    });


    after(function(done) {
        model.Book.find({
            _user: user._id
        }, function(err, books) {
            if (err) {
                return done(err);
            }
            books.forEach(function(book) {
                book.remove();
            });
            done();
        });
    });

    after(function(done) {
        roles.forEach(function(v) {
            v.remove();
        });

        user.remove(done);
    });


});

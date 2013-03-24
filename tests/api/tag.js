var QUnit = require('qunit-cli'),
    assert = QUnit.assert,
    request = require('request'),
    shared = require('../shared');
    
QUnit.module('Tag');

QUnit.asyncTest('list tags unauthenticated', function() {
    request(shared.api + '/tag/list', { jar: false }, function(err, res, body) {
        assert.equal(res.statusCode, 401);
        assert.equal(body, 'Error=AuthRequired');
        QUnit.start();
    });
});

QUnit.asyncTest('list tags', function() {
    request(shared.api + '/tag/list', function(err, res, body) {
        assert.equal(res.statusCode, 200);
        assert.ok(/json/.test(res.headers['content-type']));
    
        body = JSON.parse(body);
    
        // the results can come back in different orders, so sort them
        body.tags.sort(function(a, b) {
            return a.id <= b.id ? -1 : 1;
        });
    
        assert.deepEqual(body, {
            tags: [
                { id: 'user/' + shared.userID + '/label/bar',  sortID: 0 },
                { id: 'user/' + shared.userID + '/label/baz',  sortID: 0 },
                { id: 'user/' + shared.userID + '/label/foo',  sortID: 0 },
                { id: 'user/' + shared.userID + '/label/test', sortID: 0 }
            ]
        });
    
        QUnit.start();
    });
});
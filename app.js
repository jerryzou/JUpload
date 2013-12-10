// Generated by CoffeeScript 1.6.3
var MongoClient, ObjectID, app, express, fm, fs, http, path;

express = require('express');

http = require('http');

path = require('path');

fm = require('formidable');

fs = require('fs');

ObjectID = require('mongodb').ObjectID;

MongoClient = require('mongodb').MongoClient;

app = express();

app.set('port', 3000);

app.set('dbUrl', 'mongodb://localhost:27017/filesDB');

app.use(app.router);

app.use(express["static"](path.join(__dirname, 'public')));

MongoClient.connect(app.get('dbUrl'), function(err, db) {
  return app.set('collection', db.collection('files'));
});

app.post('/fileimport', function(req, res) {
  var nfm;
  nfm = new fm.IncomingForm({
    uploadDir: __dirname + '/public/uploadfiles',
    keepExtensions: true
  });
  nfm.parse(req, function(error, fields, files) {});
  nfm.on('field', function(field, value) {
    return nfm[field] = value;
  });
  nfm.on('fileBegin', function(name, file) {
    var filedes;
    filedes = {
      'filename': file.name,
      'serverPath': file.path,
      'originalSize': nfm.filesize,
      'originalLMD': nfm.lastModifiedDate,
      'finish': false
    };
    return app.get('collection').insert(filedes, {
      w: 1
    }, function(err, result) {
      return nfm.fileId = result[0]._id;
    });
  });
  return nfm.on('file', function(name, file) {
    return app.get('collection').update({
      _id: nfm.fileId
    }, {
      $set: {
        finish: true
      }
    }, {
      w: 1
    }, function(err, result) {
      return res.send(nfm.fileId.toString());
    });
  });
});

app.post('/fileimport/:fid', function(req, res) {
  var nfm;
  nfm = new fm.IncomingForm();
  nfm.onPart = function(part) {
    return part.on('data', function(buffer) {
      return fs.writeSync(nfm.fd, buffer, 0, buffer.length, null, 'Binary');
    });
  };
  return app.get('collection').findOne({
    _id: new ObjectID(req.params.fid)
  }, function(err, item) {
    if (item) {
      return fs.open(item.serverPath, 'a', function(err, fd) {
        nfm.fd = fd;
        return nfm.parse(req, function(error, fields, files) {
          fs.closeSync(fd);
          return fs.stat(item.serverPath, function(err, stat) {
            if (stat.size.toString() === item.originalSize.toString()) {
              return app.get('collection').update({
                _id: item._id
              }, {
                $set: {
                  finish: true
                }
              }, {
                w: 1
              }, function(err, result) {
                return res.send(item._id.toString());
              });
            } else {
              return res.end();
            }
          });
        });
      });
    } else {
      return res.end();
    }
  });
});

app.get('/fileimport', function(req, res) {
  return app.get('collection').findOne({
    filename: req.query.filename,
    originalSize: req.query.filesize,
    originalLMD: req.query.lastModifiedDate,
    finish: false
  }, function(err, item) {
    if (item) {
      return fs.stat(item.serverPath, function(err, stat) {
        return res.send({
          exist: true,
          id: item._id,
          currentSize: stat.size
        });
      });
    } else {
      return res.send({
        exist: false
      });
    }
  });
});

app.get('/fileimport/:fid', function(req, res) {
  return app.get('collection').findOne({
    _id: new ObjectID(req.params.fid)
  }, function(err, item) {
    if (item) {
      return res.download(item.serverPath, item.filename);
    } else {
      return res.end();
    }
  });
});

http.createServer(app).listen(app.get('port'), function() {
  return console.log('Express server listening on port ' + app.get('port'));
});

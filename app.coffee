express = require 'express'
http = require 'http'
path = require 'path'
fm = require 'formidable'
fs = require 'fs'
ObjectID = require('mongodb').ObjectID
MongoClient = require('mongodb').MongoClient

app = express()
app.set 'port', 3000
app.set 'dbUrl', 'mongodb://localhost:27017/filesDB'
app.use app.router
app.use express.static(path.join(__dirname, 'public'))

MongoClient.connect app.get('dbUrl'), (err,db) -> app.set 'collection', db.collection('files')

app.post '/fileimport', (req,res) ->
  nfm = new fm.IncomingForm
    uploadDir: __dirname + '/public/uploadfiles'
    keepExtensions: true
  nfm.parse req, (error,fields,files) ->
  nfm.on 'field', (field,value) -> nfm[field] = value
  nfm.on 'fileBegin', (name, file) ->
    filedes = 'filename':file.name, 'serverPath':file.path, 'originalSize':nfm.filesize, 'originalLMD':nfm.lastModifiedDate, 'finish':false
    app.get('collection').insert filedes, {w:1}, (err, result) -> nfm.fileId = result[0]._id;
  nfm.on 'file', (name, file) -> 
    app.get('collection').update {_id:nfm.fileId}, {$set:{finish:true}}, {w:1}, (err, result) -> res.send nfm.fileId.toString()

app.post '/fileimport/:fid', (req,res) ->
  nfm = new fm.IncomingForm()
  nfm.onPart = (part) -> part.on 'data',(buffer) -> fs.writeSync nfm.fd, buffer, 0, buffer.length, null, 'Binary'
  app.get('collection').findOne {_id: new ObjectID(req.params.fid)}, (err, item) ->
    if item
      fs.open item.serverPath, 'a', (err, fd) ->
        nfm.fd = fd
        nfm.parse req, (error,fields,files) ->
          fs.closeSync fd
          fs.stat item.serverPath, (err,stat) ->
            if stat.size.toString() is item.originalSize.toString()
              app.get('collection').update {_id:item._id}, {$set:{finish:true}}, {w:1}, (err, result) -> res.send item._id.toString()
            else res.end()
    else res.end()

app.get '/fileimport', (req,res) ->
  app.get('collection').findOne {filename: req.query.filename, originalSize: req.query.filesize, originalLMD: req.query.lastModifiedDate, finish: false}, (err, item) ->
    if item
      fs.stat item.serverPath, (err,stat) -> res.send exist: true, id: item._id, currentSize: stat.size
    else res.send exist: false

app.get '/fileimport/:fid', (req,res) ->
  app.get('collection').findOne {_id: new ObjectID(req.params.fid)}, (err, item) ->
    if item
      res.download(item.serverPath, item.filename)
    else res.end()

http.createServer(app).listen app.get('port'), -> console.log 'Express server listening on port ' + app.get('port')
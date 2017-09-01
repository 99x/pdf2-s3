'use strict';

var AWS = require('aws-sdk'),
    URL = require('url'),
    http = require('http'),
    https = require('https'),
    uuid = require('node-uuid'),
    path = require('path'),
    s3 = new AWS.S3();

var protocols = {
    'http:': http,
    'https:': https
};

var downloadPdf = function(url, fn) {
    var urlObj = URL.parse(url),
        protocol = protocols[urlObj.protocol];

    if (path.extname(urlObj.pathname) !== '.pdf') {
        throw '[URLError] Given url is not a pdf link';
    }

    protocol.get(url, function(res) {
        var chunks = [];
        var fileSize = parseFloat(res.headers['content-length']);
        var downloadedSize = 0;
        // Gets called each time when the buffer is full.
        res.on('data', function (chunk) {
            downloadedSize += chunk.length;
            var percentage=(downloadedSize/fileSize * 100).toFixed(2);
            console.log('downloading...' + percentage + '%');
            chunks.push(chunk);
        });
        // Gets called once the stream is finished.
        res.on('end', function () {
            console.log('finished downloading.');
            fn(null, chunks);
        });
    }).on('error', function(err) {
        fn('[CaptureFailure] ' + err);
    });

};

var validateKey = function (key) {
    var key = key || uuid.v1(),
        extension = path.extname(key);
    if (!!extension && extension === '.pdf') { 
        return key;
    } else {
        return key + '.pdf';
    }
};

var uploadToS3 = function(options, data, fn) {
    var pdfBuffer = new Buffer.concat(data),
        params = {
            Bucket: options.bucketName,
            Key: validateKey(options.key),
            ContentType: 'application/pdf',
            ContentDisposition: 'inline',
            Body: pdfBuffer
        };

    s3.putObject(params, function(err, response) {
        if (err) {
            fn('[UploadFailure] ' + err);
        } else {
            console.log('uploaded to s3');
            fn(null, params.Key);
        }
    });
};

var start = function(options, callback) {
    if (!options.url) {
        throw '[URLError] Url is empty or not provided.';
    }
    downloadPdf(options.url, function(err, data) {
        if (err) {
            throw '[DownloadError] Could not downlod the pdf';
        } else {
            uploadToS3(options, data, callback);
        }
    });
};
module.exports.start = start;
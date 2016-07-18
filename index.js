'use strict';

var AWS = require('aws-sdk'),
    URL = require('url'),
    http = require('http'),
    https = require('https'),
    uuid = require('node-uuid'),
    s3 = new AWS.S3();

var protocols = {
    'http:': http,
    'https:': https
};

var downloadPdf = function(url, fn) {
    var protocol = protocols[URL.parse(url).protocol];
    protocol.get(url, function(res) {
        var chunks = [];
        // Gets called each time when the buffer is full.
        res.on('data', function(chunk) {
            chunks.push(chunk);
        });
        // Gets called once the stream is finished.
        res.on('end', function() {
            fn(null, chunks);
        });
    }).on('error', function(err) {
        fn('[CaptureFailure] ' + err);
    });
};

var uploadToS3 = function(bucketName, data, fn) {
    var pdfBuffer = new Buffer.concat(data),
        uniqId = uuid.v1(),
        params = {
            Bucket: bucketName,
            Key: 'uploads/' + uniqId + '.pdf',
            ContentType: 'application/pdf',
            ContentDisposition: 'inline',
            Body: pdfBuffer
        };

    s3.putObject(params, function(err, response) {
        if (err) {
            fn('[UploadFailure] ' + err);
        } else {
            fn(null, params.Key);
        }
    });
};

var start = function(url, bucketName, callback) {
    if (!url) {
        throw '[URLError] Url is empty or not provided.';
    }
    downloadPdf(url, function(err, data) {
        if (err) {
            throw '[DownloadError] Could not downlod the pdf';
        } else {
            uploadToS3(bucketName, data, callback);
        }
    });
};
module.exports.start = start;
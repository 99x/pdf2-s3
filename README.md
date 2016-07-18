# Description

This library will download a pdf from a given url and upload it to a given s3 bucket.

## How to install
Clone or download the repo.
Open a terminal or a command prompt inside the folder.
```
npm install
```

## Prerequisite 
You should have AWS configuration settings setup before using Pdf2S3. If you haven't done that already,
Create a credentials file at ~/.aws/credentials on Mac/Linux or C:\Users\USERNAME\.aws\credentials on Windows. 
Add your credentials to that .aws file as follows.

```
[default]
aws_access_key_id = your_access_key
aws_secret_access_key = your_secret_key
```
More Information : https://aws.amazon.com/sdk-for-node-js

## How to Use
```
var Pdf2S3 = require('pdf2-s3'),
    url = 'https://test.com/test.pdf',
    bucketName = 'my-pdf-upload-bucket';
    
Pdf2S3.start(url, bucketName, function(err, path) {
        // path variable contains the s3 bucket file url of the uploaded pdf. 
        if (err) {
            /* Your error handling code */
        } else {
            var pathToS3PdfUrl = path;
            /* Your code here */
        }
    });

```





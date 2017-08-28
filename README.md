# Description

This library will download a pdf from a given web url and upload it to a given s3 bucket.

## How to install
```
npm install pdf2-s3
```

## Prerequisite 
You should have AWS configuration settings setup before using Pdf2S3. If you haven't done that already,
Create a credentials file at ~/.aws/credentials on Mac/Linux or C:\Users\USERNAME\\.aws\credentials on Windows. 
Add your credentials to that .aws file as follows.

```
[default]
aws_access_key_id = your_access_key
aws_secret_access_key = your_secret_key
```
More Information : http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html

## How to Use
```javascript
var Pdf2S3 = require('pdf2-s3'),
    options = {
        url: 'https://test.com/test.pdf', 
        bucketName: 'my-pdf-uploads', 
        key: 'subfolder-name/pdf-name.pdf' // optional
    }
   
Pdf2S3.start(options, function(err, path) {
        // path variable contains the s3 bucket file url of the uploaded pdf. 
        if (err) {
            console.log(err);
            /* Your error handling code */
        } else {
            console.log(path);
            /* Your code here */
        }
    });

```





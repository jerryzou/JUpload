JUpload
================================

An HTML5, Easy-to-implement, both-front-and-back-ends, and customizable solutions for asynchronous and resumable file upload.

*In case you want to have a look: [Demo Link](http://jerryit.com/jupload).*

Features
------------------------

* **Easy to implement:** JUpload's client side is a jQuery plugin and the server side is a Node app.

* **Asynchronous:** Upload process causes no interruption to a user's interaction with the web app.

* **Resumable:** Any upload process interrupted by user operations or unexpected errors is resumable.

* **Configurable & Customizable:** JUpload is an open source project which you can easily set up or customize for production.

* **Large Files Support:** Proceed or pause large files upload arbitrarily. Neither a second nor a byte is wasted.

* **Multiple Threads Capacity:** Proceed hundreds of files upload within one second. Batch operations are also available for users to proceed or pause.

* **Folder Upload Support:** Upload a folder including any file in any level of subdirectories.

* **Drag & Drop Support:** Drag files and drop them to browser to upload.

* **Progress Monitoring:** Every uploading file has its own progress bar.

Get Started
------------------------

**Firstly,** [download the zip file](https://github.com/jerryzou/JUpload/archive/master.zip) of this demo and unzip it to wherever you like.

**Secondly,** download and install [Node.js](http://nodejs.org/download/) and [MongoDB](http://www.mongodb.org/downloads) if you haven't. Don't forget to start MongoDB server after the installation.

**Lastly,** At command line and under the directory you unzipped the demo, enter: `node app` or if you have CoffeeScript installed, enter: `coffee app.coffee` Then use your favourate browser to visit the following url: `http://localhost:3000`

Usage & Demos
------------------------

### Via Html
The easist way is adding `data-plugin="JUpload"` to a file input botton to automatically give it default JUpload features.
[Demo Link](http://jerryit.com/jupload#viahtml)

### Via Javascript
Assume the id of a file input is `jupload1`. The javascript could go like: `$("#jupload1").JUpload();`
[Demo Link](http://jerryit.com/jupload#viajavascript)
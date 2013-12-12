JUpload
================================

An HTML5, Easy-to-implement, both-front-and-back-ends, and customizable solutions for asynchronous and resumable file upload.

*In case you want to have a look: [Demo Link](http://jerryit.com/jupload).*

[![Jupload File Uploading](http://jerryit.com/jupload/imgs/juploadfileui.png)](http://jerryit.com/jupload)

Features
------------------------

* **Easy to implement:** JUpload's client side is a jQuery plugin and the server side is a Node app.

* **Asynchronous:** Upload process causes no interruption to a user's interaction with the web app.

* **Resumable:** Any upload process interrupted by user operations or unexpected errors is resumable.

* **Mobile Friendly:** No plugin needed. Get along well with unstable mobile network and prevent traffic from wasting.

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

### Change Input Style
As we might feel a little bit uncomfortable about the default look of the file input, let's change it with the `customInput` option. `$("#jupload2").JUpload({customInput:true});`
[Demo Link](http://jerryit.com/jupload#cis)

### Specify Message Div
As we have noticed, the files upload UI is automatically rendered below the form. However sometimes we need to render it in a specific place. How about the div whose id is `messages3` on the right hand? We could simply do it by adding the `fileContainer` option. `$("#jupload3").JUpload({customInput:true, fileContainer:$("#messages3")});`
[Demo Link](http://jerryit.com/jupload#cis)

### Multiple Message Divs & Drag Support
Yet we still haven't been satisfied because it might be better sometimes if each input has its own specified message div. Oh, it could be even better if we can drag files into any div when we need to.
Luckily it's not that complicated as it looks like. Firstly, let's assgin an identical class, for example let's say `mfi-msg`, to each div that we choose to be the message area. Then with a single line of Javascript:
`$(".ju-mfi2").JUpload({customInput:true, fileContainer:$(".mfi-msg"), dragSupport:true});`
[Demo Link](http://jerryit.com/jupload#mmdds)

### Folder Upload & Auto Start
We would be really unhappy if we need to upload all files in a folder with complexly structured subfolders. It will definitely save us a lot of clicks if the upload program does the dirty work for us. Here comes the Folder Upload feature for the rescue.
Let's do a little arrangement. How about we still begin with a normal file input `u-fu-files`. And next to it we place an input `u-fu-folder` with folder upload feature. Then we can choose between them according to our mood... Below the inputs we will have two message divs. The left one `m-u-fu-files` for normal files chosen and the right one `m-u-fu-folder` for files chosen by folder upload feature. The normal file input might looks a little pale compared with its sibling. So let's give it an auto start feature which allows the uploading process to begin automatically after some files are chosen. This time we will need two lines of Javascript to do the job. Should be enough to ask for raises...
`$("#ju-fu-files").JUpload({customInput:true, fileContainer:$("#m-ju-fu-files"), autoStart:true});`
`$("#ju-fu-folder").JUpload({customInput:true, fileContainer:$("#m-ju-fu-folder"), folderUpload:true});`
[Demo Link](http://jerryit.com/jupload#fuas)

### Server Url & Batch Control
For some older browsers that doesn't support JUpload, we may still want its original server side script to handel the files uploaded. But we need JUpload's server side handler to take over automatically if the browser is compatible. In this case we could just keep the upload form's original action attribute and then specify a Server Url when we invoke JUpload. Our original form looks like:
`<form action="/original" method="POST" enctype="multipart/form-data">`
However only by doing this should not make our next example attractive. Let's add another feature called Batch Control which allows us to action or pause all uploads together when there are more than two files. Okey, now let's have a look at our Javascript.
`$("#ju-subc").JUpload({serverUrl:'/fileimport', batchControl:true});`
[Demo Link](http://jerryit.com/jupload#subc)

### Size, Type & Number Limit
Assume we're running a photo storage site. So we need to limit uploaded file types to jpg, jpeg and png. In addition the size of any file should be less then 2MB and the number of files should be less than 10 at a time. Let's get our hands dirty and implement these limits.
`$('#ju-stnl').JUpload({extFilter:"jpg|jpeg|png", maxSize:2*1024*1024, maxNumberFiles:10, batchControl:true});`
[Demo Link](http://jerryit.com/jupload#stnl)

Customize
------------------------

#### Something to confess...

I have to go ahead and admit that JUpload is still at its early stage of development. It might be okey for playing around or some not-too-serious implementations. However for production purpose it still needs some customization accordingly.

#### Something about the source code...

Both the server side (**/app.coffee**) and the client side (**/public/js/jupload.coffee**) of JUpload have been written in CoffeeScript. But if you are not a CoffeeScript fan, the compiled js files should also be easy to modify.

#### Something about the client side...

The client side of JUpload is merely a jQuery plugin jupload.js (the compressed version is jupload.min.js) which should be not too hard to customize. Therefore the only hard dependence for JUpload to run in browser is the jQuery library. As for this demo, I have imported some other css or js files, but it's for this demo only.

#### Something about the server side...

The main part of the server side is just a js file (app.js) with dozens of lines which is running with the power of Node. And MongoDB which serves as the persistent layer for file information storage could be replaced with any other database. In fact we can even go without database at all. For example we can use arrays instead. Yet we may lose the capacity of resuming paused upload due to server error or app crash.

#### Something about the coupling html and css...

I am really mortified about the coupling html and css in the client side jQuery plugin. However I haven't found an elegant way to get rid of them and still keep the esay-to-implement feature. If you only want to change how the upload UI looks like, just define a css file with classes used by the plugin. And if you want to make a whole new UI, you may need to rewrite the html template defined in the source code.

About
------------------------

#### Motivation

I was refactoring one of my project dealing with docs search and generating the other day, thinking about how to improve the experience of the docs upload. So far as I knew, file upload is so widely implemented in websties and web apps, however, uploading files through web browser could be painful experience for both users and developers because the native http protocol is a little too simple to achieve a lot of sophisticated features. After hours of serious googling, I couldn't find an open source solution with all the features I want. So I decided to create JUpload for anyone who is seeking something silmilar like me.

#### Thinking & Trying
For the sake of user experience, **Flash** or **Java Applet** seem not to be in the candidate list. Considering more and more traffic comes from mobiles, maybe stay in pure **Javascript** will assure most of compatibility. At least we sitll have **jQuery** to shorten the development circle. Additionally, jQuery plugin could also be easily integrated by other projects.

For sending files to server, the good news is popular browsers nowadays all support **XHR2** pretty well. But the bad news is it doesn't have native support to pause or resume the sending process. Being resumable is very important because files like videos and photos taken by smartphones are getting larger and the mobile network is often unstable. Therefore it will save a lot of traffic if the sending process is able to resume from the break point.

At first, I tried slicing files into chunks and sending them with **Socket.IO**. But the problem is it generates too many requests and slows down the progress and if the process fails, we might waste some traffic as well. So in the end I decided to send data as much as possible. If the process fails, the server will keep record of everything to power possible resuming.

For the server side support, the powerful asynchronous capacity of **Node.js** is really suitable for handling multiple uploaded files. Furthermore We could use **Express** to handle upload, resuming, download request within one end point. As for parsing large data, **Formidable** will come in handy. However we need to overwrite its native method a little to gain the ability of handling resuming upload.

#### Many Thanks

I really appreciate all the amazing projects which made this shabby little project possible and I also want to thank all the brilliant people who created them.

* **CoffeeScript:** Perhaps lots of senior js developers seem it as unnecessary, but I myself, as a js rookie, really love it...

* **jQuery:** A jQuery plugin is really easy to write and reuse by others.

* **Node.js:** I could never find anything else faster for handling hundreds of uploaded files simultaneously yet asynchronously.

* **Express:** Even though I've only leveraged a little bit of its routes handling ability, I can't help digging deeper.

* **Formidable:** I reckon it as the first choice in Node when it comes to form data parsing. Really fast and stable.

* **MongoDB:** It's amazingly easy to set up and use. In addition it works really fine with Node.

* **Bootstrap:** I can never deliver the demo so fast without it.

* **Font Awesome:** As for icons, it's good alternative to default Glyphicons in Bootstrap.

#### Change Log

* V0.1.0 (10 December 2013) - First Release
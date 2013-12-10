// Generated by CoffeeScript 1.6.3
+(function($) {
  var FileUpload, JUpload;
  $.event.props.push("dataTransfer");
  $.fn.JUpload = function(options) {
    var xhr;
    xhr = new XMLHttpRequest();
    return this.each(function(i) {
      if (xhr.upload) {
        return new JUpload(i, $(this), options);
      }
    });
  };
  JUpload = (function() {
    function JUpload(i, el, options) {
      var acceptAttr, ext, inputTemplate, parent, settings, _i, _len, _ref,
        _this = this;
      settings = {
        serverUrl: el.closest('form').attr('action')
      };
      this.settings = $.extend(settings, options);
      this.existFiles = [];
      parent = el.closest('form').length > 0 ? el.closest('form') : el.parent();
      parent.find("button[type='submit']").hide();
      if (!this.settings.fileContainer) {
        this.settings.fileContainer = $("<div class='fileContainer'></div>");
        parent.after(this.settings.fileContainer);
      } else {
        this.settings.fileContainer = $(i <= this.settings.fileContainer.length - 1 ? this.settings.fileContainer[i] : this.settings.fileContainer[this.settings.fileContainer.length - 1]);
      }
      el.on('change', $.proxy(this.fileSeclectHandler, this));
      if (this.settings.dragSupport) {
        parent.on('dragover dragleave', this.fileDragHandler);
        this.settings.fileContainer.on('dragover dragleave', this.fileDragHandler);
        parent.on('drop', $.proxy(this.fileSeclectHandler, this));
        this.settings.fileContainer.on('drop', $.proxy(this.fileSeclectHandler, this));
      }
      if (this.settings.extFilter) {
        acceptAttr = '';
        _ref = this.settings.extFilter.split('|');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ext = _ref[_i];
          acceptAttr = acceptAttr + "." + ext + ',';
        }
        el.attr('accept', acceptAttr.substr(0, acceptAttr.length - 1));
      }
      if (this.settings.folderUpload) {
        el.attr('webkitdirectory', true).attr('directory', true);
      }
      if (this.settings.customInput) {
        inputTemplate = this.settings.folderUpload ? "<button class='btn btn-info btn-sm btn-custom btn-custom" + (i + 1) + "'><i class='fa fa-folder-open'></i> Choose Folder</button>" : "<button class='btn btn-info btn-sm btn-custom" + (i + 1) + "'><i class='fa fa-file'></i> Choose Files</button>";
        el.addClass('hidden').after(inputTemplate).next('button').on('click', function(e) {
          e.preventDefault();
          return el.click();
        });
      }
      if (this.settings.batchControl) {
        this.settings.fileContainer.prepend("<div class='alert alert-info batchop'>                                        <button class='btn btn-info btn-xs playall'><i class='fa fa-play'> UPLOAD ALL</i></button>                                        <button class='btn btn-info btn-xs pauseall'><i class='fa fa-pause'> PAUSE ALL</i></button>                                        <button class='btn btn-info btn-xs closeall'><i class='fa fa-times'> CLOSE ALL</i></button>                                        </div>");
        this.batchop = this.settings.fileContainer.find('.batchop');
        this.batchop.on('click', '.playall', function() {
          return _this.settings.fileContainer.find('.play').click();
        });
        this.batchop.on('click', '.pauseall', function() {
          return _this.settings.fileContainer.find('.pause').click();
        });
        this.batchop.on('click', '.closeall', function() {
          _this.settings.fileContainer.find('.close').click();
          return el.val('');
        });
      }
    }

    JUpload.prototype.fileDragHandler = function(e) {
      e.stopPropagation();
      e.preventDefault();
      return $(e.target).toggleClass("dragHover", e.type === "dragover");
    };

    JUpload.prototype.fileSeclectHandler = function(e) {
      var f, file, files, newFileFlag, _i, _len, _results;
      if (e.type === "drop") {
        this.fileDragHandler(e);
      }
      files = e.target.files || e.dataTransfer.files;
      if (this.settings.maxNumberFiles < this.existFiles.length + files.length) {
        return this.settings.fileContainer.prepend("<div class='alert alert-warning'>Exceeded the limit number of files. Please choose less files.</div>").find('.alert:first').fadeIn().delay(2000).fadeOut();
      } else {
        _results = [];
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          newFileFlag = true;
          if (file.name.trim().indexOf('.') === 0) {
            newFileFlag = false;
          }
          if (newFileFlag) {
            $.each(this.existFiles, function(i, item) {
              if (JSON.stringify(item) === JSON.stringify(file)) {
                return newFileFlag = false;
              }
            });
          }
          if (newFileFlag) {
            this.existFiles.push(file);
            if (this.existFiles.length > 1 && this.settings.batchControl) {
              this.batchop.fadeIn();
            }
            f = new FileUpload(file, this.settings);
            f.fileUploadView.delay(200 * (_i <= 4 ? _i : 5)).fadeIn();
            _results.push(this.fileRemoveHandler(f));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    JUpload.prototype.fileRemoveHandler = function(f) {
      var _this = this;
      return f.fileUploadView.find('.close').on('click', function() {
        f.fileUploadView.fadeOut(500, function() {
          return this.remove();
        });
        if (_this.existFiles.length <= 2 && _this.settings.batchControl) {
          _this.batchop.fadeOut();
        }
        return $.each(_this.existFiles, function(i, item) {
          if (JSON.stringify(item) === JSON.stringify(f.file)) {
            return !_this.existFiles.splice(i, 1);
          }
        });
      });
    };

    return JUpload;

  })();
  FileUpload = (function() {
    function FileUpload(file, settings) {
      this.file = file;
      this.settings = settings;
      this.fileUploadView = $("<div class='alert alert-info'>                          <button type='button' class='close'>×</button>                          <button class='btn btn-default btn-xs play' disabled><i class='fa fa-play'> UPLOAD</i></button>                          <button class='btn btn-default btn-xs pause' disabled><i class='fa fa-pause'> PAUSE</i></button>                          <span class='ptext'>0%</span><i class='fa fa-cog fa-spin' style='display:none'></i><div class='progress'>                          <div class='finfo'>" + this.file.name + " (" + (this.convertSize()) + ")</div>                          <div class='progress-bar'></div></div></div>");
      this.playBtn = this.fileUploadView.find('.play');
      this.pauseBtn = this.fileUploadView.find('.pause');
      this.ptxt = this.fileUploadView.find('.ptext');
      this.cog = this.fileUploadView.find('.fa-cog');
      this.pgCnt = this.fileUploadView.find('.progress');
      this.inf = this.fileUploadView.find('.finfo');
      this.pgBar = this.fileUploadView.find('.progress-bar');
      this.settings.fileContainer.append(this.fileUploadView);
      this.checkFile();
    }

    FileUpload.prototype.convertSize = function() {
      var sizeLength;
      sizeLength = this.file.size.toString().length;
      if (sizeLength <= 6) {
        return (this.file.size / 1024).toFixed(2) + "KB";
      } else if ((6 < sizeLength && sizeLength <= 9)) {
        return (this.file.size / 1024 / 1024).toFixed(2) + "MB";
      } else {
        return (this.file.size / 1024 / 1024 / 1024).toFixed(2) + "GB";
      }
    };

    FileUpload.prototype.checkFile = function() {
      var ext, re, valid,
        _this = this;
      valid = true;
      if (this.settings.extFilter) {
        ext = this.file.name.substr((~-this.file.name.lastIndexOf(".") >>> 0) + 2);
        re = new RegExp(this.settings.extFilter, "ig");
        valid = re.test(ext);
      }
      if (this.settings.maxSize) {
        valid = this.file.size < this.settings.maxSize;
      }
      if (valid) {
        this.playBtn.on('click', $.proxy(this.sendData, this));
        return this.checkServerFile();
      } else {
        this.ptxt.text('Unsupported file!');
        this.fileUploadView.removeClass('alert-info').addClass('alert-warning');
        return setTimeout((function() {
          return _this.fileUploadView.find('.close').click();
        }), 2000);
      }
    };

    FileUpload.prototype.checkServerFile = function() {
      var that;
      that = this;
      return $.getJSON(this.settings.serverUrl, {
        filename: this.file.name,
        filesize: this.file.size,
        lastModifiedDate: this.file.lastModifiedDate
      }, function(data) {
        return that.setView(data);
      });
    };

    FileUpload.prototype.setView = function(data) {
      this.playBtn.removeAttr("disabled");
      if (data.exist) {
        this.fid = data.id;
        this.fcurrentSize = data.currentSize;
        this.fprogress = (this.fcurrentSize / this.file.size * 100).toFixed(2) + "%";
        this.pgBar.css("width", this.fprogress);
        this.ptxt.text(this.fprogress);
      }
      if (this.settings.autoStart && !data.exist || this["break"]) {
        return this.sendData();
      }
    };

    FileUpload.prototype.sendData = function() {
      var err, formData, url, xhr,
        _this = this;
      formData = new FormData();
      url = '';
      if (this.fcurrentSize) {
        formData.append('slice', this.file.slice(this.fcurrentSize, this.file.size));
        url = this.settings.serverUrl + "/" + this.fid;
      } else {
        this.fcurrentSize = 0;
        formData.append('filesize', this.file.size);
        formData.append('lastModifiedDate', this.file.lastModifiedDate);
        formData.append('file', this.file);
        url = this.settings.serverUrl;
      }
      xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("loadstart", function(e) {
        _this.playBtn.off('click').attr("disabled", "disabled");
        _this.pauseBtn.on('click', function() {
          return xhr.abort();
        }).removeAttr("disabled");
        _this.cog.fadeIn();
        _this.pgCnt.addClass('progress-striped active');
        return _this.pgBar.removeClass('progress-bar-warning');
      });
      xhr.upload.addEventListener("progress", function(e) {
        var progress;
        progress = ((e.loaded + _this.fcurrentSize) / (e.total + _this.fcurrentSize) * 100).toFixed(2) + "%";
        _this.pgBar.css("width", progress);
        return _this.ptxt.text(progress);
      });
      xhr.upload.addEventListener("abort", $.proxy(this.breakUpload, this));
      xhr.upload.addEventListener("error", $.proxy(this.breakUpload, this));
      xhr.upload.addEventListener("loadend", function(e) {
        _this.cog.fadeOut();
        _this.pgCnt.removeClass('progress-striped active');
        return _this.pauseBtn.off('click').attr("disabled", "disabled");
      });
      xhr.open("POST", url, true);
      try {
        xhr.send(formData);
      } catch (_error) {
        err = _error;
        breakUpload();
      }
      return xhr.addEventListener('readystatechange', function(e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
          _this.pgBar.addClass("progress-bar-success");
          return _this.inf.wrapInner("<a target='_blank' href='" + _this.settings.serverUrl + "/" + xhr.responseText + "'></a>");
        }
      });
    };

    FileUpload.prototype.breakUpload = function() {
      var _this = this;
      this.cog.fadeOut();
      this.pauseBtn.off('click').attr("disabled", "disabled");
      this.playBtn.on('click', function() {
        return _this.checkServerFile();
      }).removeAttr('disabled');
      this.pgCnt.removeClass('progress-striped active');
      this.pgBar.addClass('progress-bar-warning');
      return this["break"] = true;
    };

    return FileUpload;

  })();
  return $(document).on('click.JUpload', '[data-plugin="JUpload"]', function() {
    return $(this).JUpload();
  });
})(jQuery);
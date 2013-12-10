# JUpload V0.1.0

+(($) ->
  # For jquery file drag suppoot
  $.event.props.push "dataTransfer"

  # PLUGIN DEFININTION
  $.fn.JUpload = (options) ->
    xhr = new XMLHttpRequest()
    @each (i) -> new JUpload i,$(@),options if xhr.upload

  # JUpload CLASS DEFINITION
  class JUpload
    constructor: (i,el,options) ->
      settings = serverUrl: el.closest('form').attr('action')
      @settings = $.extend settings, options
      @existFiles = []
      parent = if el.closest('form').length > 0 then el.closest('form') else el.parent()
      parent.find("button[type='submit']").hide()
      if not @settings.fileContainer
        @settings.fileContainer = $("<div class='fileContainer'></div>")
        parent.after @settings.fileContainer
      else
        @settings.fileContainer = $(if i <= @settings.fileContainer.length - 1 then @settings.fileContainer[i] else @settings.fileContainer[@settings.fileContainer.length - 1])
      el.on 'change', $.proxy(@fileSeclectHandler,@)
      if @settings.dragSupport
        parent.on 'dragover dragleave', @fileDragHandler
        @settings.fileContainer.on 'dragover dragleave', @fileDragHandler
        parent.on 'drop', $.proxy(@fileSeclectHandler,@)
        @settings.fileContainer.on 'drop', $.proxy(@fileSeclectHandler,@)
      if @settings.extFilter
        acceptAttr = ''
        for ext in @settings.extFilter.split('|')
          acceptAttr = acceptAttr + "." + ext + ','
        el.attr 'accept', acceptAttr.substr(0,acceptAttr.length-1)
      if @settings.folderUpload
        el.attr('webkitdirectory',true).attr('directory',true)
      if @settings.customInput
        inputTemplate = if @settings.folderUpload then "<button class='btn btn-info btn-sm btn-custom btn-custom"+(i+1)+"'><i class='fa fa-folder-open'></i> Choose Folder</button>" else "<button class='btn btn-info btn-sm btn-custom"+(i+1)+"'><i class='fa fa-file'></i> Choose Files</button>"
        el.addClass('hidden').after(inputTemplate).next('button').on 'click', (e) ->
          e.preventDefault()
          el.click()
      if @settings.batchControl
        @settings.fileContainer.prepend("<div class='alert alert-info batchop'>
                                        <button class='btn btn-info btn-xs playall'><i class='fa fa-play'> UPLOAD ALL</i></button>
                                        <button class='btn btn-info btn-xs pauseall'><i class='fa fa-pause'> PAUSE ALL</i></button>
                                        <button class='btn btn-info btn-xs closeall'><i class='fa fa-times'> CLOSE ALL</i></button>
                                        </div>")
        @batchop = @settings.fileContainer.find('.batchop')
        @batchop.on 'click', '.playall', => @settings.fileContainer.find('.play').click()
        @batchop.on 'click', '.pauseall', => @settings.fileContainer.find('.pause').click()
        @batchop.on 'click', '.closeall', =>
          @settings.fileContainer.find('.close').click()
          el.val('')

    fileDragHandler: (e) ->
      e.stopPropagation()
      e.preventDefault()
      $(e.target).toggleClass "dragHover", e.type is "dragover"

    fileSeclectHandler: (e) ->
      @fileDragHandler(e) if e.type is "drop"
      files = e.target.files or e.dataTransfer.files
      if @settings.maxNumberFiles < @existFiles.length + files.length
        @settings.fileContainer.prepend("<div class='alert alert-warning'>Exceeded the limit number of files. Please choose less files.</div>").find('.alert:first').fadeIn().delay(2000).fadeOut()
      else
        for file in files
          newFileFlag = true
          newFileFlag = false if file.name.trim().indexOf('.') is 0
          if newFileFlag
            $.each @existFiles, (i, item) -> newFileFlag = false if JSON.stringify(item) is JSON.stringify(file)
          if newFileFlag
            @existFiles.push file
            @batchop.fadeIn() if @existFiles.length > 1 and @settings.batchControl
            f = new FileUpload(file, @settings)
            f.fileUploadView.delay(200*(if _i <=4 then _i else 5)).fadeIn()
            @fileRemoveHandler(f)

    fileRemoveHandler: (f) ->
      f.fileUploadView.find('.close').on 'click', =>
        f.fileUploadView.fadeOut(500,->@remove())
        @batchop.fadeOut() if @existFiles.length <= 2 and @settings.batchControl
        $.each @existFiles, (i, item) ->
          if JSON.stringify(item) is JSON.stringify(f.file)
            not _this.existFiles.splice(i,1)

  # FileUpload CLASS DEFINITION
  class FileUpload
    constructor: (@file, @settings) ->
      @fileUploadView = $("<div class='alert alert-info'>
                          <button type='button' class='close'>×</button>
                          <button class='btn btn-default btn-xs play' disabled><i class='fa fa-play'> UPLOAD</i></button>
                          <button class='btn btn-default btn-xs pause' disabled><i class='fa fa-pause'> PAUSE</i></button>
                          <span class='ptext'>0%</span><i class='fa fa-cog fa-spin' style='display:none'></i><div class='progress'>
                          <div class='finfo'>#{@file.name} (#{@convertSize()})</div>
                          <div class='progress-bar'></div></div></div>")
      @playBtn = @fileUploadView.find('.play')
      @pauseBtn = @fileUploadView.find('.pause')
      @ptxt = @fileUploadView.find('.ptext')
      @cog = @fileUploadView.find('.fa-cog')
      @pgCnt = @fileUploadView.find('.progress')
      @inf = @fileUploadView.find('.finfo')
      @pgBar = @fileUploadView.find('.progress-bar')
      @settings.fileContainer.append(@fileUploadView)
      @checkFile()

    convertSize: ->
      sizeLength = @file.size.toString().length
      if sizeLength <= 6
        (@file.size / 1024).toFixed(2) + "KB"
      else if 6 < sizeLength <= 9
        (@file.size / 1024 / 1024).toFixed(2) + "MB"
      else
        (@file.size / 1024 / 1024 / 1024).toFixed(2) + "GB"

    checkFile: ->
      valid = true
      if @settings.extFilter
        ext = @file.name.substr((~-@file.name.lastIndexOf(".") >>> 0) + 2)
        re = new RegExp(@settings.extFilter,"ig")
        valid = re.test(ext)
      valid = @file.size < @settings.maxSize if @settings.maxSize
      if valid
        @playBtn.on 'click', $.proxy(@sendData,@)
        @checkServerFile()
      else
        @ptxt.text 'Unsupported file!'
        @fileUploadView.removeClass('alert-info').addClass('alert-warning')
        setTimeout ( => @fileUploadView.find('.close').click()),2000

    checkServerFile: ->
      that = @
      $.getJSON @settings.serverUrl, 
        {filename: @file.name, filesize: @file.size, lastModifiedDate: @file.lastModifiedDate},
        (data) ->
          that.setView(data)

    setView: (data) ->
      @playBtn.removeAttr "disabled"
      if data.exist
        @fid = data.id
        @fcurrentSize = data.currentSize
        @fprogress = (@fcurrentSize / @file.size * 100).toFixed(2) + "%"
        @pgBar.css "width",@fprogress
        @ptxt.text @fprogress
      @sendData() if @settings.autoStart and not data.exist or @break

    sendData: ->
      formData = new FormData()
      url = ''
      if @fcurrentSize
        formData.append 'slice',@file.slice(@fcurrentSize,@file.size)
        url = @settings.serverUrl + "/" + @fid
      else
        @fcurrentSize = 0
        formData.append 'filesize', @file.size
        formData.append 'lastModifiedDate', @file.lastModifiedDate
        formData.append 'file',@file
        url = @settings.serverUrl
      xhr = new XMLHttpRequest()
      xhr.upload.addEventListener "loadstart", (e) =>
        @playBtn.off('click').attr("disabled","disabled")
        @pauseBtn.on('click', -> xhr.abort()).removeAttr("disabled")
        @cog.fadeIn()
        @pgCnt.addClass('progress-striped active')
        @pgBar.removeClass('progress-bar-warning')
      xhr.upload.addEventListener "progress", (e) =>
        progress = ((e.loaded+@fcurrentSize) / (e.total+@fcurrentSize) * 100).toFixed(2) + "%"
        @pgBar.css "width",progress
        @ptxt.text progress
      xhr.upload.addEventListener "abort", $.proxy(@breakUpload,@)
      xhr.upload.addEventListener "error", $.proxy(@breakUpload,@)
      xhr.upload.addEventListener "loadend", (e) =>
        @cog.fadeOut()
        @pgCnt.removeClass('progress-striped active')
        @pauseBtn.off('click').attr("disabled","disabled")
      xhr.open "POST", url, true
      try xhr.send formData; catch err then breakUpload()
      xhr.addEventListener 'readystatechange', (e) =>
        if xhr.readyState is 4 and xhr.status is 200
          @pgBar.addClass "progress-bar-success"
          @inf.wrapInner "<a target='_blank' href='"+@settings.serverUrl+"/"+xhr.responseText+"'></a>"

    breakUpload: ->
      @cog.fadeOut()
      @pauseBtn.off('click').attr("disabled","disabled")
      @playBtn.on('click', => @.checkServerFile()).removeAttr('disabled')
      @pgCnt.removeClass('progress-striped active')
      @pgBar.addClass('progress-bar-warning')
      @break = true

  # Support initialization without js
  $(document).on 'click.JUpload', '[data-plugin="JUpload"]', -> $(@).JUpload()

)(jQuery)
---
title: "在线工具：JSON转Golang Struct"
description: "在线JSON转Golang Struct工具,JSON转Golang 结构体,JSON转Struct,JSON转Go"
keywords: ["JSON转go", "JSON转换", "JSON转Golang Struct"]
date: 2021-07-20T10:53:56+08:00
type: ext
layout: tools
---
{{< html >}}
  <div class="t-btn d-flex justify-content-center">
    <button class="btn"  id="btnExpan"> 转换-展开 </button>
    <button class="btn"  id="btnNest"> 转换-嵌套 </button>
    <button class="btn btn-default" data-clipboard-action="copy" id="btnCopy"> 复制 </button>
    <button class="btn btn-default" id="btnClear"> 清空 </button>
  </div> 
  <div class="row">
    <div class="t-editarea col-lg-6 col-md-12" onpaste="setTimeout(pasteConvert,1)"> 
      <label class="col-form-label"> JSON </label>
      <div id="input" class="t-textarea fullHeight fixed-size"></div> 
    </div> 
    <div class="t-editarea col-lg-6 col-md-12">
      <div>
         <label class="col-form-label"> GO </label> 
        <div class="float-end align-items-end">
          <label class="col-form-label">Tag：</label>
          <input type="text" class="form-control float-end" value="json" id="tag" style="width:80px;height:100%;">
        </div>
      </div>
      <div class="t-textarea fullHeight fixed-size" id="output"></div> 
    </div> 
  </div>
  <script src="https://cdn.bootcss.com/clipboard.js/2.0.4/clipboard.min.js">
	</script>
  <script src="/js/jquery.js"></script>
  <script src="/js/tools.js?v=0.0.3"></script>
  <script src="/js/json2go.js?v=0.0.1"></script>
  <script>
    let input = new highlight(
      document.getElementById("input"), 
      "javascript", 
      '{"url":"https://www.printlove.cn"}'
    )

    let output = new highlight(
      document.getElementById("output"), 
      "go", 
      '等待转化结果...'
    )

    document.getElementById("btnClear").onclick = function() {
        cleanup(input, output)
    }

    function tagName() {
      return document.getElementById("tag").value
    }
  
    document.getElementById("btnExpan").onclick = function() {
      convert(true, tagName())
    }
    document.getElementById("btnNest").onclick = function() {
      convert(false, tagName())
    }
    function pasteConvert() {
      convert(true, tagName())
    }

    function convert(flat=true, tagName="json") {
      let res = json2go(input.getValue(), null, tagName, flat);
      if (res.error) {
          output.setError(res.error)
          return
      }
      output.setValue(res.go)
    }
    convert()
    listenMode(input, output)
    copy(output)
	</script>
  {{< /html >}}
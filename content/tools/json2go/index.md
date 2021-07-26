---
title: "在线工具：JSON转Golang Struct"
description: "在线JSON转Golang Struct工具,JSON转Golang 结构体,JSON转Struct,JSON转Go"
keywords: ["JSON转go", "JSON转换", "JSON转Golang Struct"]
date: 2021-07-20T10:53:56+08:00
type: ext
layout: tools
---
{{< navmain `/tools/json2go` >}}
{{< html >}}
  <div class="row"> 
    <div class="t-editarea col-lg-5 col-md-12" onpaste="setTimeout(pasteConvert,1)"> 
      <label class="col-form-label"> JSON </label> 
      <pre id="input" class="t-textarea fullHeight fixed-size form-control" contenteditable="plaintext-only">{"url":"https://www.printlove.cn"}</pre> 
    </div> 
    <div class="t-btn col-lg-1 col-md-12">
      <button class="btn"  id="btnExpan"> 转换-展开 </button>
      <button class="btn"  id="btnNest"> 转换-嵌套 </button>
      <button class="btn btn-default" data-clipboard-action="copy" data-clipboard-target="#output"> 复制 </button>
      <button class="btn btn-default" onclick="cleanup()"> 清空 </button>
    </div> 
    <div class="t-editarea col-lg-6 col-md-12"> 
      <label class="col-form-label"> GO </label> 
      <div class="float-end align-items-end">
        <label class="col-form-label">Tag：</label>
        <input type="text" class="form-control float-end" value="json" id="tag" style="width:80px;">
      </div>
      <pre class="t-textarea fullHeight fixed-size form-control"><code id="output"></code></pre> 
    </div> 
  </div>
  <script src="https://cdn.bootcss.com/highlight.js/9.15.9/highlight.min.js">
	</script> 
  <script src="https://cdn.bootcss.com/highlight.js/9.15.9/languages/json.min.js">
	</script> 
  <script src="https://cdn.bootcss.com/highlight.js/9.15.9/languages/go.min.js">
	</script> 
  <script src="https://cdn.bootcss.com/clipboard.js/2.0.4/clipboard.min.js">
	</script> 
  <script src="/js/json2go.js"></script>
  <script src="/js/common.js"></script>
  <script>
    function tagName() {
      return document.getElementById("tag").value
    }
    convert()
    document.getElementById("btnExpan").onclick = function() {
      convert(true, tagName())
    }
    document.getElementById("btnNest").onclick = function() {
      convert(false, tagName())
    }
    function pasteConvert() {
      convert(true, tagName())
    }
	</script>
  {{< /html >}}
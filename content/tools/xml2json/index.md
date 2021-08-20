---
title: "在线工具：XML转JSON"
description: "在线XML转JSON工具"
keywords: ["xml", "json", "xml转json"]
date: 2021-08-13T11:53:56+08:00
type: ext
layout: tools
---
{{< navmain `/tools/xml2json` >}}
{{< html >}}
  <div class="row"> 
    <div class="t-editarea col-lg-5 col-md-12" onpaste="setTimeout(convert,1)"> 
      <label class="col-form-label"> XML </label> 
      <div id="input" class="t-textarea fullHeight fixed-size"></div> 
    </div>
    <div class="t-btn col-lg-1 col-md-12">
      <button class="btn"  id="btnExpan"> 转换 </button>
      <button class="btn btn-default" data-clipboard-action="copy" id="btnCopy"> 复制 </button>
      <button class="btn btn-default" id="btnClear"> 清空 </button>
    </div> 
    <div class="t-editarea col-lg-6 col-md-12"> 
      <label class="col-form-label"> JSON </label> 
      <div class="t-textarea fullHeight fixed-size" id="output"></div> 
    </div>
  </div>
  <script src="https://cdn.bootcss.com/clipboard.js/2.0.4/clipboard.min.js">
	</script> 
  <script src="/js/jquery.js"></script>
  <script src="/layer/layer.js"></script>
  <script src="/js/tools.js?v=0.0.3"></script>
  <script>
    function formatJson(msg) {
      let jsonStr = JSON.stringify(JSON.parse(msg), null, 4)
      return jsonStr;
    }

    document.getElementById("btnExpan").onclick = function() {
      convert()
    }

    let input = new highlight(
      document.getElementById("input"), 
      "xml", 
      initXml
    )

    let output = new highlight(
      document.getElementById("output"), 
      "javascript", 
      '等待转化结果...'
    )
    
    document.getElementById("btnClear").onclick = function() {
        cleanup(input, output)
    }
    function convert() {
      let schema = input.getValue()
      if (schema != "") {
        $.ajax({
          url: "/api/xml2json",
          type: "post",
          data: {
            schema: schema
          },
          success: function(res) {
            if (res.error != "") {
              layer.alert(res.error)
            } else {
              output.setValue(formatJson(res.data))
            }
          } 
        })
      }
    }
    convert()
    listenMode(input, output)
    copy(output)
	</script> 
  {{< /html >}}
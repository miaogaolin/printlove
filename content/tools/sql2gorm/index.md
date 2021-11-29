---
title: "在线工具：SQL转GORM Model"
description: "在线SQL转Golang Struct工具,SQL转GORM模型,SQL转Struct,SQL转Go"
keywords: ["SQL转go", "SQL转换", "SQL转GORM"]
date: 2021-07-20T10:53:56+08:00
type: ext
layout: tools
---
{{< html >}}
   <div class="t-btn d-flex justify-content-center">
    <button class="btn"  id="btnExpan"> 转换 </button>
    <button class="btn btn-default" data-clipboard-action="copy" id="btnCopy"> 复制 </button>
    <button class="btn btn-default" id="btnClear"> 清空 </button>
  </div> 
  <div class="row">
    <div class="t-editarea col-lg-6 col-md-12" onpaste="setTimeout(convert,1)"> 
      <label class="col-form-label"> SQL </label> 
      <div id="input" class="t-textarea fullHeight fixed-size"></div> 
    </div>
    <div class="t-editarea col-lg-6 col-md-12"> 
      <label class="col-form-label"> GORM </label> 
      <div class="t-textarea fullHeight fixed-size" id="output"></div> 
    </div>
  </div>
  <script src="https://cdn.bootcss.com/clipboard.js/2.0.4/clipboard.min.js">
	</script> 
  <script src="/js/jquery.js"></script>
  <script src="/layer/layer.js"></script>
  <script src="/js/tools.js?v=0.0.3"></script>
  <script>
    document.getElementById("btnExpan").onclick = function() {
      convert()
    }

    let input = new highlight(
      document.getElementById("input"), 
      "sql", 
      initSQl
    )

    let output = new highlight(
      document.getElementById("output"), 
      "go", 
      '等待转化结果...'
    )
    
    document.getElementById("btnClear").onclick = function() {
        cleanup(input, output)
    }
    function convert() {
      let sql = input.getValue()
      if (sql != "") {
        $.ajax({
          url: "/api/sql2gorm",
          type: "post",
          data: {
            ddl: sql
          },
          success: function(res) {
            if (res.error != "") {
              layer.alert(res.error)
            } else {
              output.setValue(res.data)
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
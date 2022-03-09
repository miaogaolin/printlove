---
title: "在线工具：YAML转Go Struct"
description: "在线 SQL 转 MongoDB 工具"
keywords: ["sql转mongodb", "sql转mongo"]
date: 2022-03-09T11:08:56+08:00
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
      <label class="col-form-label"> MongoDB </label> 
      <div class="t-textarea fullHeight fixed-size" id="output"></div> 
    </div>
  </div>
  <script src="https://cdn.bootcss.com/clipboard.js/2.0.4/clipboard.min.js">
	</script> 
  <script src="/js/jquery.js"></script>
  <script src="/layer/layer.js"></script>
  <script src="/js/tools.js?v=0.0.3"></script>
  <script src="/js/sql2mongodb.js?v=0.0.2"></script>
  <script>
    let input = new highlight(
      document.getElementById("input"), 
      "javascript", 
      "select id,salary from employee where age >= 35 and (designation = 'manager' or (lastname = 'johnson' and firstname like '%john%'))"
    )

    let output = new highlight(
      document.getElementById("output"), 
      "json", 
      '等待转化结果...'
    )

    document.getElementById("btnClear").onclick = function() {
        cleanup(input, output)
    }

    document.getElementById("btnExpan").onclick = function() {
      convert()
    }
   
    function convert() {
      let res = sql_to_mongodb(input.getValue());
      output.setValue(res)
    }
    convert()
    listenMode(input, output)
    copy(output)
	</script>
  {{< /html >}}
    {{< html >}}<div class="tool-info">{{< /html >}}
  仅支持查询语句。
  {{< html >}}</div>{{< /html >}}
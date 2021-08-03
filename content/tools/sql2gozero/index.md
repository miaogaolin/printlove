---
title: "在线工具：SQL转go-zero Model"
description: "无需下载，在线SQL转go-zero model，粘贴即可生成"
date: 2021-07-20T10:53:56+08:00
type: ext
layout: tools
---
{{< navmain `/tools/sql2gozero`>}}
{{< html >}}
<div class="row"> 
  <div class="t-editarea col-lg-5 col-md-12" onpaste="setTimeout(convert,1)"> 
    <label class="col-form-label"> SQL </label> 
    <div id="input" class="t-textarea fullHeight fixed-size"></div>
  </div>
  <div class="t-btn col-lg-1 col-md-12">
    <button class="btn"  id="btnExpan"> 转换 </button>
    <button class="btn btn-default" data-clipboard-action="copy" data-clipboard-target="#output"> 复制 </button>
    <button class="btn btn-default" onclick="cleanup()"> 清空 </button>

  </div> 
  <div class="t-editarea col-lg-6 col-md-12"> 
    <label class="col-form-label"> go-zero </label>
    <div class="checkbox float-end align-items-end">
      <label class="col-form-label">
        <input type="checkbox" id="cache" class="form-check-input" checked> 启用缓存
      </label>
    </div>
    <div id="output" class="t-textarea fullHeight fixed-size"></div> 
  </div>
  </div>
  <script src="https://cdn.bootcss.com/clipboard.js/2.0.4/clipboard.min.js">
	</script> 
  <script src="/js/jquery.js"></script>
  <script src="/js/tools.js"></script>
  <script src="/layer/layer.js"></script>
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
    
    let cacheEle = document.getElementById("cache") 
    function convert() {
      let cache = 0
      if (cacheEle.checked) {
        cache = 1
      }
      let sql = input.getValue()
      if (sql != "") {
        $.ajax({
          url: "/api/sql2gozero",
          type: "post",
          data: {
            ddl: sql,
            cache: cache
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
	</script>
  {{< /html >}}
  {{< html >}}<div class="tool-info">{{< /html >}}
**说明：**
  
1.基于项目： [https://github.com/tal-tech/go-zero](https://github.com/tal-tech/go-zero)

2.手动增加 `var.go` 文件
```go
package model

import "github.com/tal-tech/go-zero/core/stores/sqlx"

var ErrNotFound = sqlx.ErrNotFound
```

{{< html >}}</div>{{< /html >}}
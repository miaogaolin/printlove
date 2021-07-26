---
title: "在线工具：SQL转go-zero Model"
description: "无需下载，在线SQL转go-zero model，粘贴即可生成"
keywords: ["SQL转go", "SQL转换", "sql转go-zero"]
date: 2021-07-20T10:53:56+08:00
type: ext
layout: tools
---
{{< navmain `/tools/sql2gozero`>}}
{{< html >}}
<div class="row"> 
  <div class="t-editarea col-lg-5 col-md-12" onpaste="setTimeout(convert,1)"> 
    <label class="col-form-label"> SQL </label> 
    <pre id="input" class="t-textarea fullHeight fixed-size form-control" contenteditable="true">CREATE TABLE `blacklists`  (
`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
`email` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
`type` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
`created_at` timestamp NULL DEFAULT NULL,
`updated_at` timestamp NULL DEFAULT NULL,
PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;
    </pre> 
  </div>
  <div class="t-btn col-lg-1 col-md-12">
    <button class="btn"  id="btnExpan"> 转换 </button>
    <button class="btn btn-default" data-clipboard-action="copy" data-clipboard-target="#output"> 复制 </button>
    <button class="btn btn-default" onclick="cleanup()"> 清空 </button>

  </div> 
  <div class="t-editarea col-lg-6 col-md-12"> 
    <label class="col-form-label"> GORM </label>
    <div class="checkbox float-end align-items-end">
      <label class="col-form-label">
        <input type="checkbox" id="cache" class="form-check-input" checked> 启用缓存
      </label>
    </div>
    <pre class="t-textarea fullHeight fixed-size form-control"><code id="output"></code></pre> 
</div>

  <script src="https://cdn.bootcss.com/highlight.js/9.15.9/highlight.min.js">
	</script> 
  <script src="https://cdn.bootcss.com/highlight.js/9.15.9/languages/sql.min.js">
	</script> 
  <script src="https://cdn.bootcss.com/highlight.js/9.15.9/languages/go.min.js">
	</script> 
  <script src="https://cdn.bootcss.com/clipboard.js/2.0.4/clipboard.min.js">
	</script> 
  <script src="/js/jquery.js"></script>
  <script src="/layer/layer.js"></script>
  <script src="/js/common.js"></script>
  <script>
    document.getElementById("btnExpan").onclick = function() {
      convert()
    }

    let input = document.getElementById("input"),
      output = document.getElementById("output"),
      cacheEle = document.getElementById("cache")
    
    function convert() {
      let cache = 0
      if (cacheEle.checked) {
        cache = 1
      }
      let sql = input.innerText
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
              output.innerHTML = hljs.highlight("go", res.data).value
            }
          } 
        })
      }
     
      input.innerHTML = hljs.highlight("sql", sql).value
    }


    convert()
	</script>
  {{< /html >}}
**说明：**
  
* 基于项目： [https://github.com/tal-tech/go-zero](https://github.com/tal-tech/go-zero)
* 手动增加 `var.go` 文件
```go
package model

import "github.com/tal-tech/go-zero/core/stores/sqlx"

var ErrNotFound = sqlx.ErrNotFound
```
---
title: "在线工具：SQL转entgo schema"
description: "无需下载，在线SQL转entgo schema，粘贴即可生成"
date: 2021-07-20T10:53:56+08:00
type: ext
layout: tools
---
{{< navmain `/tools/sql2ent`>}}
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
    <label class="col-form-label"> entgo schema</label>
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
      output = document.getElementById("output")
    
    function convert() {
      let sql = input.innerText
      if (sql != "") {
        $.ajax({
          url: "/api/sql2ent",
          type: "post",
          data: {
            ddl: sql
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
  {{< html >}}<div class="tool-info">{{< /html >}}
**说明：**
  
目前项目正处于完善阶段，如果您遇到任何问题，都可在下方留言，我看到都会及时回复，并且改进。


**进入开源：**

经过调研（手动找），市面上这个完善的工具还没有，因此计划将此项目着重开发并且开源，以供大家使用。

项目开源地址：[https://www.github.com/miaogaolin/sql2ent](https://www.github.com/miaogaolin/sql2ent)

{{< html >}}</div>{{< /html >}}
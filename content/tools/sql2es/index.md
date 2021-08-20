---
title: "在线工具：SQL转ElasticSearch DSL"
description: "在线SQL转ElasticSearch DSL"
date: 2021-08-18T11:53:56+08:00
type: ext
layout: tools
---
{{< navmain `/tools/sql2es` >}}
{{< html >}}
  <div class="row"> 
    <div class="t-editarea col-lg-5 col-md-12" onpaste="setTimeout(convert,1)"> 
      <label class="col-form-label"> SQL </label> 
      <div id="input" class="t-textarea fullHeight fixed-size"></div> 
    </div>
    <div class="t-btn col-lg-1 col-md-12">
      <button class="btn"  id="btnExpan"> 转换 </button>
      <button class="btn btn-default" data-clipboard-action="copy" id="btnCopy"> 复制 </button>
      <button class="btn btn-default" id="btnClear"> 清空 </button>
    </div> 
    <div class="t-editarea col-lg-6 col-md-12"> 
      <label class="col-form-label"> ElasticSearch DSL </label> 
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
      "sql", 
      initSelectSql
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
          url: "/api/sql2es",
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
    {{< html >}}<div class="tool-info">{{< /html >}}
## 基于项目
  
[github.com/cch123/elasticsql](https://github.com/cch123/elasticsql)

## 当前支持

- [x] sql and expression
- [x] sql or expression
- [x] equal(=) support
- [x] not equal(!=) support
- [x] gt(>) support
- [x] gte(>=) support
- [x] lt(<) support
- [x] lte(<=) support
- [x] sql in (eg. id in (1,2,3) ) expression
- [x] sql not in (eg. id not in (1,2,3) ) expression
- [x] paren bool support (eg. where (a=1 or b=1) and (c=1 or d=1))
- [x] sql like expression (currently use match phrase, perhaps will change to wildcard in the future)
- [x] sql order by support
- [x] sql limit support
- [x] sql not like expression
- [x] field missing check
- [x] support aggregation like count(\*), count(field), min(field), max(field), avg(field)
- [x] support aggregation like stats(field), extended_stats(field), percentiles(field) which are not standard sql function
- [ ] null check expression(is null/is not null)
- [ ] join expression
- [ ] having support

{{< html >}}</div>{{< /html >}}
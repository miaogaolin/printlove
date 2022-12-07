

let initSQl = "CREATE TABLE `blacklists`  (\n" +
    "`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,\n" +
    "`email` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,\n" +
    "`type` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,\n" +
    "`created_at` timestamp NULL DEFAULT NULL,\n" +
    "`updated_at` timestamp NULL DEFAULT NULL,\n" +
    "PRIMARY KEY (`id`) USING BTREE\n" +
    ") ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;"

let initSelectSql = "select * from aaa\n\
where a=1 and x = '三个男人'\n\
and create_time between '2015-01-01T00:00:00+0800' and '2016-01-01T00:00:00+0800'\n\
and process_id > 1 order by id desc limit 100,10"

let initYaml = 'kind: test\n\
metadata:\n\
    name: cluster\n\
    nullfield:\n\
    nestedstruct:\n\
    - nested:\n\
        underscore_field: value\n\
        field1:\n\
        - 44.5\n\
        - 43.6\n\
        field2:\n\
        - true\n\
        - false\n\
    nested2:\n\
        - nested3:\n\
            field1:\n\
            - 44\n\
            - 43\n\
            fieldt:\n\
            - true\n\
            - false\n\
            field3: value\n\
abc:\n\
    - def:\n\
    - black\n\
    - white\n\
array1:\n\
    - "string1"\n\
    - "string2"\n\
array2:\n\
    - 2\n\
    - 6\n\
array3:\n\
    - 3.14\n\
    - 5.12\n\
is_underscore: true\n\
'

let initXml = '<?xml version="1.0" encoding="UTF-8"?>\n\
<osm version="0.6" generator="CGImap 0.0.2">\n\
 <bounds minlat="54.0889580" minlon="12.2487570" maxlat="54.0913900" maxlon="12.2524800"/>\n\
 <foo>bar</foo>\n\
</osm>'
function cleanup(input, output) {
    input.setValue("")
    output.setValue("")
}

new ClipboardJS('.btn').on('success', function () {
    layer.msg('复制成功')
}).on('error', function () {
    layer.msg('复制失败,请手动复制')
});

function highlight(ele, lang, value) {
    this.key = "hbs-mode"
    this.lightTheme = "default"
    this.darkTheme = "monokai"
    this.currentTheme = this.lightTheme
    this.mode = lang
    this.lineNumbers = true
    this.value = value
    this.codemirror = {}
    this.init = function () {
        let mode = localStorage.getItem(this.key);
        if (mode == "dark") {
            this.currentTheme = this.darkTheme
        } else {
            this.currentTheme = this.lightTheme
        }
        this.codemirror = CodeMirror(ele, {
            value: this.value,
            mode: this.mode,
            theme: this.currentTheme,
            lineNumbers: this.lineNumbers,
            scrollbarStyle: "simple"
        })
    }
    this.change = function (callback) {
        this.codemirror.on("change", callback)
    }
    this.setLang = function (lang) {
        this.lang = lang
        this.codemirror.setOption("mode", lang)
    }
    this.setDark = function () {
        this.currentTheme = this.darkTheme
        this.codemirror.setOption("theme", this.currentTheme)
    }
    this.setLight = function () {
        this.currentTheme = this.lightTheme
        this.codemirror.setOption("theme", this.currentTheme)
    }

    this.getValue = function () {
        return this.codemirror.getValue()
    }

    this.setValue = function (val) {
        this.val = val
        this.codemirror.setOption("value", val)
    }

    this.setError = function (err) {
        this.val = err
        this.codemirror.setOption("value", "Error: " + err)
    }
    this.init()
}

let modeSwitcher = document.getElementById("modeSwitcher")
function listenMode(input, output) {
    modeSwitcher.addEventListener('change', function () {
        if (modeSwitcher.checked) {
            input.setDark()
            output.setDark()
        } else {
            input.setLight()
            output.setLight()
        }
    })
}

function copy(output) {
    let btnCopy = document.getElementById("btnCopy")
    btnCopy.setAttribute("data-clipboard-text", output.getValue())
    output.change(function (obj) {
        btnCopy.setAttribute("data-clipboard-text", obj.getValue())
    })
}
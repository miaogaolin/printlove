

let initSQl = "CREATE TABLE `blacklists`  (\n"+
"`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,\n"+
"`email` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,\n"+
"`type` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,\n"+
"`created_at` timestamp NULL DEFAULT NULL,\n"+
"`updated_at` timestamp NULL DEFAULT NULL,\n"+
"PRIMARY KEY (`id`) USING BTREE\n"+
") ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;"

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

function cleanup(input, output) {
    input.setValue("")
    output.setValue("")
}

new ClipboardJS('.btn').on('success', function() {
    alert('复制成功')
}).on('error', function() {
    alert('复制失败,请手动复制')
});

function highlight(ele, lang, value) {
    this.key = "hbs-mode"
    this.lightTheme = "default"
    this.darkTheme = "nord"
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
            mode:  this.mode,
            theme: this.currentTheme,
            lineNumbers:this.lineNumbers
        })
    }
    this.change = function(callback) {
        this.codemirror.on("change", callback)
    }
    this.setLang = function(lang) {
        this.lang = lang
        this.codemirror.setOption("mode", lang)
    }
    this.setDark = function() {
        this.currentTheme = this.darkTheme
        this.codemirror.setOption("theme", this.currentTheme)
    }
    this.setLight = function() {
        this.currentTheme = this.lightTheme
        this.codemirror.setOption("theme", this.currentTheme)
    }

    this.getValue = function() {
        return this.codemirror.getValue()
    }

    this.setValue = function(val) {
        this.val = val
        this.codemirror.setOption("value", val)
    }
    this.init()
}

let modeSwitcher = document.getElementById("modeSwitcher")
function listenMode(input, output) {
    modeSwitcher.addEventListener('change', function() {
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
    output.change(function(obj) {
        btnCopy.setAttribute("data-clipboard-text", obj.getValue())
    })
}


let initSQl = "CREATE TABLE `blacklists`  (\n"+
"`id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,\n"+
"`email` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,\n"+
"`type` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,\n"+
"`created_at` timestamp NULL DEFAULT NULL,\n"+
"`updated_at` timestamp NULL DEFAULT NULL,\n"+
"PRIMARY KEY (`id`) USING BTREE\n"+
") ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;"

function cleanup() {
    document.getElementById('input').innerHTML = ""
    document.getElementById('output').innerHTML = '';
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
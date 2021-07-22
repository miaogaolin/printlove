// https://github.com/freshcn/sql2stuctForGorm/blob/master/js/sql2struct.js
// 首字母大写
function titleCase(str) {

    var array = str.toLowerCase().split("_"),
    upperArr = getUpperChar();
    
    for (var i = 0; i < array.length; i++) {
        if (upperArr.indexOf(array[i]) >= 0) {
            array[i] = array[i].toUpperCase()
        } else {
            array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
        }
    }
    var string = array.join("");

    return string;
}

//　需要特别处理的全大写的关键词
function getUpperChar() {
    return ["id", "ip", "api", "uuid"]
}


function sqlToGorm() {
    // 类型映射
    let m =  {
            'tinyint': 'int',
            'smallint': 'int',
            'int': 'int',
            'mediumint': 'int64',
            'bigint': 'int64',
            'float': 'float64',
            'double': 'float164',
            'decimal': 'float64',
            'char': 'string',
            'varchar': 'string',
            'text': 'string',
            'mediumtext': 'string',
            'longtext': 'string',
            'time': 'time.Time',
            'date': 'time.Time',
            'datetime': 'time.Time',
            'timestramp': 'int64',
            'enum': 'string',
            'set': 'string',
            'blob': 'string'
        }
        
    this.sqlContent = ''
    this.structContent = ''
    this.activeIndex = '1'
    this.cache = null
    this.typeMap = m
    this.typeMapStr = ''
    this.useGorm = true
    this.useJson = false
    this.useForm = false
    this.dialogFormVisible = false

    this.sqlContent = function(val) {
        if (!val) {
            this.structContent = ''
            return
        }
        var res = val.split('\n')
        if (!res) {
            this.structContent = 'invalid sql'
            return
        }
        var tableComment = res[res.length-1].match(/comment=\'(.*)\'/i),
        types = this.typeMap,
        structResult = 'type ',
        pk = [],
        unique = {},
        indexs = {},
        keys = val.match(/((PRIMARY|UNIQUE)\s)?KEY\s([\`|\w|_]+\s)?\((\w|_|\`|,)+\)/g);
    
        // 开始处理索引相关
        if (keys != null &&keys.length > 0) {
            var tmpFields = [];
            keys.forEach(function(k){
                tmpFields = k.match(/\`(\w|_)+\`/g);
                for (var i = 0; i < tmpFields.length; i++) {
                    tmpFields[i] = tmpFields[i].replace(/\`/g, '');
                }
                if (k.indexOf("PRIMARY KEY ") == 0 ){
                    pk = tmpFields
                }

                if (k.indexOf("UNIQUE KEY") == 0) {
                    for (var ii = 1; ii < tmpFields.length; ii ++) {
                        if (unique[tmpFields[ii]] == undefined) {
                            unique[tmpFields[ii]] = [];
                        } 
                        unique[tmpFields[ii]].push(tmpFields[0])
                    }
                
                }

                if (k.indexOf("KEY") == 0) {
                    for (var ii = 1; ii < tmpFields.length; ii ++) {
                        if (indexs[tmpFields[ii]] == undefined) {
                            indexs[tmpFields[ii]] = [];
                        } 
                        indexs[tmpFields[ii]].push(tmpFields[0])
                    }
                }
            })
        }
        for (var i = 0, len = res.length; i < len; i++) {
            var field = res[i].match(/\`(.+)\`\s+((tinyint|smallint|int|mediumint|bigint|float|double|decimal|varchar|char|text|mediumtext|longtext|datetime|time|date|enum|set|blob)?[\([\d]+\)]?)?([\w\s\'\.]+(comment\s\'(.*)\'))?/i)

            if (i == 0) { // 第一个字段为数据表名称
                if (field && field[1] != undefined && field[2] == undefined) {
                    var tbName = titleCase(field[1])
                    
                    if ( tableComment != null && tableComment.length > 0 ) {
                        structResult = '// '+ tbName + ' ' + tableComment[1] + '\n' + structResult;
                    }
                    structResult += tbName + ' struct {'
                    continue
                } else {
                    return
                }
            } else { // 数据表字段
                if (field && field[1] != undefined && field[2] != undefined && field[3] != undefined) {
                    if (types[field[3]] != undefined) {
                        var fieldName = titleCase(field[1])
                        var fieldType = types[field[3]]
                        var fieldJsonName = field[1].toLowerCase()
                        if (fieldName.toLowerCase() == 'id') {
                            fieldName = 'ID'
                        }
                        if (field[6] != undefined) {
                            structResult += '\n\t// ' + fieldName + ' ' + field[6]
                        }
                        structResult += '\n\t' + fieldName + ' ' + fieldType + ' '
                        structArr = []
                        if (this.useGorm) {
                            var gorm = ["column:"+fieldJsonName, "type:"+field[2]]

                            if (pk.indexOf(field[1]) >= 0) {
                                gorm.push("primary_key")
                            }

                            if (unique[field[1]] != undefined) {
                                gorm.push("unique_index:"+unique[field[1]].join(','))
                            }

                            if (indexs[field[1]] != undefined) {
                                gorm.push("index:"+indexs[field[1]].join(','))
                            }

                            if (res[i].indexOf("NOT NULL") > 0) {
                                gorm.push("not null")
                            }

                            if (res[i].indexOf("AUTO_INCREMENT") > 0) {
                                gorm.push("auto_increment")
                            }

                            structArr.push('gorm:"'+gorm.join(';')+'"')
                        }
                        if (this.useJson) {
                            structArr.push('json:"' + fieldJsonName + '"')
                        }
                        if (this.useForm) {
                            structArr.push('form:"' + fieldJsonName + '"')
                        }
                        if (structArr.length > 0) {
                            structResult += '`' + structArr.join(' ') + '`'
                        }
                    } else {
                        continue
                    }
                } else {
                    continue
                }
            }
        }
        structResult += '\n}'
        this.structContent = structResult
        return structResult
    }

    this.typeMapStr = function(val) {
        var typeArr = val.split('\n')
        var typeMap = {}
        for (var i = 0, len = typeArr.length; i < len; i++) {
            var itemArr = typeArr[i].split(/\:\s+/)
            if (itemArr[0] != undefined && itemArr[1] != undefined) {
                typeMap[itemArr[0]] = itemArr[1]
            }
        }
        this.typeMap = typeMap
        var data = {
            useGorm: this.useGorm,
            useJson: this.useJson,
            useForm: this.useForm,
            typeMap: this.typeMap
        }
        this.setCache(data)
    }
}

function cleanup() {
    input.innerHTML = ""
    output.innerHTML = '';
}

new ClipboardJS('.btn').on('success', function() {
    alert('复制成功')
}).on('error', function() {
    alert('复制失败,请手动复制')
});
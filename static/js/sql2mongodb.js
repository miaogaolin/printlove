function reduce(selectNames) {

    var selectNames = selectNames.split(",");
    var res_str = "{\n"; //No i18N
    for (var i = 0; i < selectNames.length; i++) {

        res_str = res_str + putReduceContent(selectNames[i]) + "\n";
    }
    res_str = res_str + "\n   }"; //No i18N
    return res_str
}

function finalize(str) {

    var res_str = "{\n"; //No i18N
    if (str.search(/avg/ig) != -1) {

        res_str = res_str + "         prev." + averageOrg + " = "; //No i18N
        res_str = res_str + "prev." + sumAvg + " \/ "; //No i18N
        res_str = res_str + "prev." + countAvg + ";"; //No i18N
        res_str = res_str + "\n         delete prev." + sumAvg + ";"; //No i18N
        res_str = res_str + "\n         delete prev." + countAvg + ";"; //No i18N

    }

    res_str = res_str + "\n   }"; //No i18N
    return res_str;
}


function putReduceContent(str) {
    var n = str.search(" ");
    if (n != -1) {
        str = str.replace(" ", "");
    }
    var avgRegx = /^avg/ig;
    var sumRegx = /^sum/ig;
    var countRegx = /^count/ig;
    var minRegx = /^min/ig;
    var maxRegx = /^max/ig;
    var res_str = "";
    if (str.search(/\(/) != -1) {
        if (str.search(avgRegx) != -1) {

            res_str = res_str + "         prev." + sumAvg + " += " + "obj." + average_content + ";\n"; //No i18N
            res_str = res_str + "         prev." + countAvg.replace(" ", "") + "++;"; //No i18N

        } else if (str.search(sumRegx) != -1) {

            res_str = res_str + "         prev." + sumGlobal + " = prev." + sumGlobal + " + obj." + sum_content + " - 0;"; //No i18N

        } else if (str.search(countRegx) != -1) {
            var sample = str.replace("(", "");
            sample = sample.replace(")", "");
            var star = 0;
            var content = sample.replace(/count/ig, "");

            for (var i = 0; i < content.length; i++) {
                content = content.replace(" ", "");
            }

            if (content.replace(" ", "") == "*") {
                content = "star"; //No i18N
                star = 1;
            }

            count_content = content.replace(" ", "");
            if (star == 0) {

                res_str = res_str + "         if (obj." + count_content + " != null ) if ( obj." + count_content + " instanceof Array)"; //No i18N
                res_str = res_str + "prev.count" + count_content + " += obj." + count_content + ".length;"; //No i18N
                res_str = res_str + "\n         else prev.count" + count_content + "++;"; //No i18N

            } else {
                res_str = res_str + "         if (true != null ) if ( true instanceof Array)"; //No i18N
                res_str = res_str + "prev.count" + count_content + " += true.length;"; //No i18N
                res_str = res_str + "\n         else prev.count" + count_content + "++;"; //No i18N

            }

        } else if (str.search(minRegx) != -1) {

            var sample = str.replace("(", "");
            sample = sample.replace(")", "");
            var content = sample.replace(/min/ig, "");
            content = content.replace(" ", "");
            var prev = "prev.minimumvalue" + content; //No i18N

            res_str = res_str + "         prev.minimumvalue" + content + " = isNaN(" + prev + ") ? obj." + content + " : Math.min(" + prev + ", obj." + content + ");"; //No i18N

        } else if (str.search(maxRegx) != -1) {

            var sample = str.replace("(", "");
            sample = sample.replace(")", "");
            var content = sample.replace(/max/ig, "");
            content = content.replace(" ", "");
            var prev = "prev.maximumvalue" + content; //No i18N

            res_str = res_str + "         prev.maximumvalue" + content + " = isNaN(" + prev + ") ? obj." + content + " : Math.min(" + prev + ", obj." + content + ");"; //No i18N

        }
    }
    return res_str;
}

function initial(selectNames) {

    var res_str = "{\n"; //No i18N
    var sample = "";
    var selectNames = selectNames.split(",");
    for (var i = 0; i < selectNames.length; i++) {

        var n = checkOk(selectNames[i]);

        if (n != "") {

            res_str = res_str + "         " + n;

            if (i + 1 < selectNames.length) {
                res_str = res_str + ",\n"; //No i18N
            }
        }

    }
    res_str = res_str + "\n   }"; //No i18N
    return res_str;

}
var sumAvg = "";
var countAvg = "";
var sumGlobal = "";
var countGlobal = "";
var averageOrg = "";
var sum_content = "";
var count_content = "";
var average_content = "";
function checkOk(str) {

    var avgRegx = /avg/ig;
    var sumRegx = /sum/ig;
    var countRegx = /count/ig;
    var res_str = "";

    if (str.search(avgRegx) != -1) {

        var sample = str.replace("(", "");
        sample = sample.replace(")", "");
        var content = sample.replace(/avg/ig, "");
        average_content = content.replace(" ", "");
        averageOrg = "average" + content.replace(" ", ""); //No i18N
        sumAvg = "sumforaverageaverage" + content.replace(" ", ""); //No i18N
        countAvg = "countforaverageaverage" + content.replace(" ", ""); //No i18N

        var res_str = "\"sumforaverageaverage" + content.replace(" ", "") + "\": 0,\n"; //No i18N
        var res_str = res_str + "         \"countforaverageaverage" + content.replace(" ", "") + "\": 0"; //No i18N

    } else if (str.search(sumRegx) != -1) {

        var sample = str.replace("(", "");
        sample = sample.replace(")", "");
        var content = sample.replace(/sum/ig, "");
        sum_content = content.replace(" ", "");
        sumGlobal = "sum" + content.replace(" ", ""); //No i18N

        var res_str = "\"sum" + content.replace(" ", "") + "\": 0"; //No i18N

    } else if (str.search(countRegx) != -1) {
        var sample = str.replace("(", "");
        sample = sample.replace(")", "");
        var content = sample.replace(/count/ig, "");

        for (var i = 0; i < content.length; i++) {
            content = content.replace(" ", "");
        }
        if (content.search(/\*/g) != -1) {
            content = "star"; //No I18N
        }

        count_content = content.replace(" ", ""); //No I18N
        countGlobal = "count" + content.replace(" ", ""); //No I18N
        var res_str = "\"count" + content.replace(" ", "") + "\": 0"; //No I18N

    }

    return res_str.replace(" ", ""); //No I18N
}

function selectFn(str) {

    commaRegx = /,/g;
    var res_str = "{\n"; //No I18N
    if (commaRegx.test(str)) {

        var selectNames = str.split(","); //No I18N

        for (var i = 0; i < selectNames.length; i++) {

            res_str = res_str + "   \"" + selectNames[i] + "\": 1"; //No I18N

            if (i + 1 < selectNames.length) {
                res_str = res_str + ",\n"; //No I18N
            }
        }

    } else {

        res_str = res_str + "   \"" + str + "\": 1"; //No I18N

    }
    res_str = res_str + "\n}"; //No I18N
    return res_str;
}

function whereFn(str) {
    str = (str.charAt(0) == '(') ? str.substring(1) : str;
    str = (str.charAt(str.length - 1) == ')') ? str.substring(0, str.length - 1) : str;
    if (str.charAt(0) == '(') {
        str = str.substring(1);
    }
    if (str.charAt(str.length - 1) == ')') {
        str = str.substring(0, str.length - 1);
    }
    var n = str.search(/\band\b/i);
    var n1 = str.search(/\bor\b/i);

    if (n != -1 && n1 != -1) {

        if (n < n1 && n != -1) {
            //and
            if (n != -1) {
                var beforeString = str.slice(0, n);
                var afterString = str.slice(n + 4, str.length);

                var res_str = "\n   \"$and\": [{\n  " + whereFn(beforeString) + " \n    },{" + whereFn(afterString) + "\n   }]"; //No I18N
            }
            return res_str;
        } else {
            //or
            if (n1 != -1) {
                var beforeString = str.slice(0, n1);
                var afterString = str.slice(n1 + 3, str.length);

                var res_str = "\n   \"$or\": [{\n   " + whereFn(beforeString) + "\n },{" + whereFn(afterString) + "\n   }]"; //No I18N
            }
            return res_str;
        }

    } else if (n1 == -1 && n != -1) {

        var beforeString = str.slice(0, n);
        var afterString = str.slice(n + 3, str.length);

        var res_str = "\n   \"$and\": [{\n  " + whereFn(beforeString) + "\n },{" + whereFn(afterString) + "\n   }]"; //No I18N
        return res_str;

    } else if (n == -1 && n1 != -1) {
        var beforeString = str.slice(0, n1);
        var afterString = str.slice(n1 + 3, str.length);

        var res_str = "\n   \"$or\": [{\n   " + whereFn(beforeString) + "\n },{" + whereFn(afterString) + "\n   }]"; //No I18N
        return res_str;
    } else {

        var res_str = " " + checkCases(str); //No I18N
        return res_str;
    }
}
function checkCases(str) {

    var gtRegx = />/g;
    var ltRegx = /</g;
    var gteRegx = />=/g;
    var lteRegx = /<=/g;
    var gt = str.search(gtRegx);
    var gte = str.search(gteRegx);
    var lt = str.search(ltRegx);
    var lte = str.search(lteRegx);
    var ne = str.search(/!=/g);
    var eq = str.search(/=/g);
    var res_str = ""; //No I18N

    if (gt != -1) {

        var beforeString = ""; //No I18N
        var afterString = ""; //No I18N

        if (gte != -1) {

            beforeString = str.slice(0, gte);
            afterString = str.slice(gte + 2);

            if ((afterString.search("\'") == -1 && afterString.search("\"") == -1) && afterString.search(/[A-z]/) != -1) {

                res_str = res_str + "\"$where\": \"this." + beforeString + " >= " + "this." + afterString.replace("\n", "") + "\""; //No I18N
            } else {

                res_str = res_str + "\"" + beforeString + "\":{ \"$gte\" : " + afterString.replace("\n", "") + " }"; //No I18N
            }
        } else {

            beforeString = str.slice(0, gt);
            afterString = str.slice(gt + 1);

            if (afterString.search("\'") == -1 && afterString.search("\"") == -1 && afterString.search(/[A-z]/) != -1) {

                res_str = res_str + "\"$where\": \"this." + beforeString + " > " + "this." + afterString + "\""; //No I18N
            } else {

                res_str = res_str + "\"" + beforeString + "\":{ \"$gt\" : " + afterString.replace("\n", "") + " }"; //No I18N
            }
        }

    } else if (lt != -1) {

        if (lte != -1) {

            beforeString = str.slice(0, lte);
            afterString = str.slice(lte + 2);

            if (afterString.search("\'") == -1
                && afterString.search("\"") == -1
                && afterString.search(/[A-z]/) != -1) {

                res_str = res_str + "\"$where\": \"this." + beforeString + " <= " + "this." + afterString.replace("\n", "") + "\""; //No I18N
            } else {

                res_str = res_str + "\"" + beforeString + "\":{ \"$lte\" : " + afterString.replace("\n", "") + " }"; //No I18N
            }

        } else {

            beforeString = str.slice(0, lt);
            afterString = str.slice(lt + 1);

            if (afterString.search("\'") == -1 && afterString.search("\"") == -1 && afterString.search(/[A-z]/) != -1) {

                res_str = res_str + "\"$where\": \"this." + beforeString + " < " + "this." + afterString.replace("\n", "") + "\""; //No I18N
            } else {

                res_str = res_str + "\"" + beforeString + "\":{ \"$lt\" : " + afterString.replace("\n", "") + " }"; //No I18N
            }
        }

    } else if (ne != -1) {

        beforeString = str.slice(0, ne);
        afterString = str.slice(ne + 2);

        if (afterString.search("\'") == -1 && afterString.search("\"") == -1 && afterString.search(/[A-z]/) != -1) {

            res_str = res_str + "\"$where\": \"this." + beforeString + " != " + "this." + afterString.replace("\n", "") + "\""; //No I18N
        } else {

            res_str = res_str + "\"" + beforeString + "\" : { \"$ne\": " + afterString.replace("\n", "") + "}"; //No I18N
        }

    } else if (eq != -1) {

        beforeString = str.slice(0, eq);
        afterString = str.slice(eq + 1);

        if (afterString.search("\'") == -1 && afterString.search("\"") == -1 && afterString.search(/[A-z]/) != -1) {

            res_str = res_str + "\"$where\": \"this." + beforeString + " == " + "this." + afterString.replace("\n", "") + "\""; //No I18N
        } else {

            res_str = res_str + "\"" + beforeString + "\" : " + afterString.replace("\n", ""); //No I18N
        }
    } else {
        //this is for  between n all
        var inRegx = str.search(/\bin\b/i);
        if (inRegx != -1) {

            str = str.split(/\bin\b/i);
            var beforeString = str[0];
            var afterString = str[1];
            afterString = afterString.replace("(", "["); //No I18N
            afterString = afterString.replace(")", "]"); //No I18N
            res_str = res_str + "\"" + beforeString.replace(" ", "") + "\": {"; //No I18N
            res_str = res_str + "\"$in\": " + afterString + "}"; //No I18N
        }
    }
    return res_str;

}
function whereFn(str) {
    str = (str.charAt(0) == '(') ? str.substring(1) : str;
    str = (str.charAt(str.length - 1) == ')') ? str.substring(0, str.length - 1) : str;
    if (str.charAt(0) == '(') {
        str = str.substring(1);
    }
    if (str.charAt(str.length - 1) == ')') {
        str = str.substring(0, str.length - 1);
    }
    var n = str.search(/\band\b/i);
    var n1 = str.search(/\bor\b/i);

    if (n != -1 && n1 != -1) {

        if (n < n1 && n != -1) {
            //and
            if (n != -1) {
                var beforeString = str.slice(0, n);
                var afterString = str.slice(n + 4, str.length);

                var res_str = "\n   \"$and\": [{\n  " + whereFn(beforeString) + " \n    },{" + whereFn(afterString) + "\n   }]"; //No I18N
            }
            return res_str;
        } else {
            //or
            if (n1 != -1) {
                var beforeString = str.slice(0, n1);
                var afterString = str.slice(n1 + 3, str.length);

                var res_str = "\n   \"$or\": [{\n   " + whereFn(beforeString) + "\n },{" + whereFn(afterString) + "\n   }]"; //No I18N
            }
            return res_str;
        }

    } else if (n1 == -1 && n != -1) {

        var beforeString = str.slice(0, n);
        var afterString = str.slice(n + 3, str.length);

        var res_str = "\n   \"$and\": [{\n  " + whereFn(beforeString) + "\n },{" + whereFn(afterString) + "\n   }]"; //No I18N
        return res_str;

    } else if (n == -1 && n1 != -1) {
        var beforeString = str.slice(0, n1);
        var afterString = str.slice(n1 + 3, str.length);

        var res_str = "\n   \"$or\": [{\n   " + whereFn(beforeString) + "\n },{" + whereFn(afterString) + "\n   }]"; //No I18N
        return res_str;
    } else {

        var res_str = " " + checkCases(str); //No I18N
        return res_str;
    }
}
function sql_to_mongodb(input) {
    if (input.trim() != '') {
        var lines = input.split("\n");
        var ha = "";
        for (var i = 0; i < lines.length; i++) {
            ha = ha + " " + lines[i];
            ha = ha.replace("\n", "");
        }
        input = ha;

        if (input.search(/;/g) == -1) {
            input = input + ";";
        }

        var hav = input.search(/\bhaving\b/i);

        if (hav != -1) {
            var newStr = input.slice(0, hav) + ";";
            input = newStr;
        }

        if (input.search(/\bgroup\b/i) == -1) {
            //without grouping
            var n = input.search(/SELECT/ig);
            var table_name = "";
            var select_content = "";
            var where_content = "";
            var res_str = "";
            var orderBy = 0;

            if (input.search(/\border by\b/i) != -1) {
                orderBy = 1;
            }

            for (var i = n + 7; i < input.search(/from/ig); i++) {
                input = input.replace(/\blike\b/i, "=");
                if (input[i] != " ") {
                    select_content = select_content + input[i];
                }
            }

            n = input.search(/from/ig);

            if (input.search(/where/ig) != -1) {
                for (var i = n + 5; i < input.search(/where/ig); i++) {
                    table_name = table_name + input[i];
                }
            } else {
                for (var i = n + 5; i < input.search(/;/g); i++) {
                    table_name = table_name + input[i];
                }
            }

            if (orderBy == 0) {

                n = input.search(/where/ig);
                for (var i = n + 6; i < input.search(/;/ig); i++) {
                    where_content = where_content + input[i];
                }

            } else {

                n = input.search(/where/ig);
                for (var i = n + 6; i < input.search(/\border by\b/i); i++) {
                    where_content = where_content + input[i];
                }
                var orderBy_content = "";
                n = input.search(/\border by\b/i);
                for (var i = n + 8; i < input.search(/;/ig); i++) {
                    orderBy_content = orderBy_content + input[i];
                }

                var orderBy_value = 1;
                if (orderBy_content.search(/\bdesc\b/i) != -1) {
                    orderBy_value = -1;
                }
                des = orderBy_content.search(/\bdesc\b/i, "");
                if (des != -1) {
                    orderBy_content = orderBy_content.slice(0, des - 1);
                }
                asc = orderBy_content.search(/\basc\b/i, "");
                if (asc != -1) {
                    orderBy_content = orderBy_content.slice(0, asc - 1);
                }
                var l = orderBy_content.search(/[A-z]/i);
                orderBy_content = orderBy_content.slice(l);

            }

            if (select_content != "*") {

                if (orderBy == 0) {
                    res_str = res_str + "db." + table_name.replace(" ", "") + ".find({\n" + whereFn(where_content) + "\n}," + selectFn(select_content) + "\n);" //No i18N
                } else {
                    //order by
                    res_str = res_str + "db." + table_name.replace(" ", "") + ".find({\n" + whereFn(where_content) + "\n}," + selectFn(select_content) + "\n).sort({\n  \"" + orderBy_content + "\": " + orderBy_value + "\n});"; //No i18N
                }

            } else {

                if (orderBy == 0) {
                    res_str = res_str + "db." + table_name.replace(" ", "") + ".find({\n" + whereFn(where_content) + "\n});"; //No i18N
                } else {
                    //order by
                    res_str = res_str + "db." + table_name.replace(" ", "") + ".find({\n" + whereFn(where_content) + "\n}).sort({\n \"" + orderBy_content + "\": " + orderBy_value + "\n});"; //No i18N
                }
            }
        } else {
            //grouping 
            var n = input.search(/SELECT/ig);
            var table_name = "";
            var select_content = "";
            var where_content = "";
            var res_str = "";
            key_value = "";

            for (var i = n + 7; i < input.search(/from/ig); i++) {
                select_content = select_content + input[i];
            }

            n = input.search(/from/ig);
            for (var i = n + 5; i < input.search(/where/ig); i++) {
                table_name = table_name + input[i];
            }
            table_name = table_name.replace("\n", "");
            n = input.search(/group/ig);
            for (var i = n + 9; i < input.search(/;/ig); i++) {
                key_value = key_value + input[i];
            }

            n = input.search(/where/ig);
            for (var i = n + 6; i < input.search(/group/ig); i++) {
                where_content = where_content + input[i];
            }

            res_str = res_str + "db." + table_name.replace(" ", "") + ".group({\n\n   \"key\":{\n" + "         \"" + key_value + "\": true\n   }" + ",\n"; //No i18N
            res_str = res_str + "   \"initial\": " + initial(select_content) + ",\n"; //No i18N
            res_str = res_str + "   \"reduce\": function( obj , prev )" + reduce(select_content) + ",\n"; //No i18N
            res_str = res_str + "   \"finalize\": function( prev )" + finalize(select_content) + ",\n"; //No i18N
            res_str = res_str + "   \"cond\": {\n" + whereFn(where_content) + "\n   }"; //No i18N
            res_str = res_str + "\n\n});"; //No i18N
        }
        return res_str;
    } else {
        return 'Please enter some input'; //No I18N
    }

}

function formatJsonStr(str) {
    console.log(str)
    return JSON.stringify(JSON.parse(str), null, 4)
}

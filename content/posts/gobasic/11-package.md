---
title: "Go基础系列：11. 包"
date: 2021-09-01T17:35:56+08:00
draft: false
categories: ["Golang"]
tags: ["Go"]
description: "学习 Go 语言中包的声明、导入、使用、和包之间的加载顺序等等"
series: ["Go基础系列"]
---

## 学到什么

1. 什么是包？
2. 如果声明包？
3. 如何导入包？
4. 源文件的组成部分？
5. 包内容如何公开和私有？
6. main 包的作用？
7. internal 目录的作用？
8. 多个包出现导入时，之间的加载顺序是什么？

## 概念

做个类比理解下包是啥？当电脑上文件变多时，就会通过目录区分，将不同的文件有组织的归类在不同的目录下。Go 源文件也是一样，可以把不同的文件放置在不同的目录中，给目录取一个别名，就是所说的包名。

下来学习包的使用，就是熟悉 Go 项目中代码的组织结构，为了直观，直接看项目目录。在上手前首先要掌握 `go mod` 的使用，不熟悉请前往[《环境搭建 - gomod疑惑》](/posts/gobasic/3-gomod/)。

## 项目目录

创建一个 `gobasic` 的项目目录，总共包含三个部分：入口文件、gomod、自定义两个包。

![](https://printlove.cn/posts/gobasic/images/11-1.png)

调用顺序：`main.go` >> `b.go` >> `a.go` 。

下来从这三个文件入手，开始学习。

## 包声明

在源文件的开头添加如下代码格式：

```go
// a.go
package pkgA
```

`pkgA` 为自定义的包名。标准规范中，该命名与源文件所在目录名称相同。入口 "main 函数" 的所在源文件包名必须设置为 main。

在同一个包（目录）下，可以创建多个源文件。

## 包导入

声明一个包后，就可以被其它包导入使用，格式如下：

```go
// b.go
package pkgB

import "github.com/miaogaolin/gobasic/pkgA"
```

文件开头声明了源文件所在包为 `pkgB` ，下来使用 `import` 关键字导入所依赖的包。如果导入的是当前项目中的包，引用路径的规则为 "go.mod" 文件中设置的 `module` 值与依赖包的目录路径拼接。

我的项目 module 值为：
github.com/miaogaolin/gobasic

导入之后，就可以使用**“包名+点”**访问包内的变量、常量、函数、结构体、接口。

### 1. 多包导入

如果有多个包需要导入时，有两种方式，第二种为常见方式。

```go
// 第一种
import "gobasic/pkgA"
import "fmt"

// 第二种
import (
	"fmt"

	"github.com/miaogaolin/gobasic/pkgA"
)
```

引用后就可以调用包内的函数、常量、结构体等等。如果调用的函数在同一个包下，就不需要导入，可以直接调用。

### 2. 简化导入

使用“点”导入的包，在调用包内的变量、常量、函数等等，就不需要写包名。

例：
```go
import . "fmt"

// 不使用“点”导入
fmt.Println()

// 使用“点”导入
Println()
```

### 3. 别名导入

给导入的包可以使用一个别名，这样如果导入的多个包时，名称一样出现冲突时，就可以取个别名。

例：
```go
import a "exmaple/pkgA"

// a 为别名
a.Func1()
```

### 4. 匿名导入

在导入包时，如果该包没有被使用，那编译器就会报错。为了不让报错，可以使用匿名导入。那为何不直接删除呢？是因为想使用包内的 `init()` 函数，该函数在包被导入时自动调用。

例：
```go
import _ "github.com/go-sql-driver/mysql"
```

例子中，mysql 这个包内会存在一个 ”init 函数“，该函数的意义表示注册 mysql 驱动。

## 源文件组成

了解了包的声明和引用后，下来看看源文件的完整组成结构。

![](https://printlove.cn/posts/gobasic/images/11-2.png)

例：
```go
// b.go
package pkgB

import (
   "fmt"

   "github.com/miaogaolin/gobasic/pkgA"
)

var name string

func init() {
   name = "B"
}

func PrintName() {
   fmt.Println(name)
	 // 调用 pkgA 包中的一个函数
   pkgA.PrintName()
}
```

在这个例子中没有给出 `pkgA` 包的代码，完整的代码前往：

> https://github.com/miaogaolin/gobasic

下来根据这个例子讲解两个知识点，继续往下看。

### 1. 包的使用

`pkgA.PrintName()`这个访问有个前提，就是函数的命名首字母必须大写，如果是小写开头那只能在当前包内访问，而不能被其它包调用。

例如， `b.go` 文件中的 `name` 变量就不能被其它包访问。如果想要访问，就需要改为 `Name` 。函数、结构体、接口、常量，也是一样的。

总结下就是**小写字母开头私有，大写字母开头公有**。

### 2. init 函数

该函数是 Go 语言中的保留函数，当包被导入后自动执行，不需要主动调用。该函数可以在同一个包内的不同源文件中使用。如果是自定义的函数自然是不行的，相同的函数名称只能在同一个包内出现一次。

## main 包

在学习 Go 语言开始时，写了一个 "Hello World" 输出的例子中就有见过，摘取关键代码如下：

```go
// 入口文件的包名
package main

// 入口函数
func main() {
	...	
}
```

“main 包”和“main 函数” 这两者的组合，确定了程序的启动入口。

## internal 目录

这也是 Go 语言中一个特殊的目录，如果源文件在 `internal` 目录中，那该目录的父级父级目录是不能访问 internal 目录下的内容的。

这块我说的是目录，不是包名。虽然我在前面讲了，在规范中，目录名称和包名保持相同，但如果不相同语法也是正确的。

回到 internal 目录，如果 internal 目录下定义的包名不是 internal 名称，外部也是不能访问的。只要目录名称不是 internal 就算包名是，外部就能访问。

举例展示一个 internal 目录层级，说明下访问性。

- exmaple
    - dir1
        - internal
    - main.go


在上例中，internal 目录的父级父级目录是 exmaple，那在 main.go 文件中就不能访问 internal 目录中的内容。

## 包的加载顺序

这里我们从 main 包入口开始，main 包导入 pkg1，pkg1 导入 pkg2，pkg2 导入 pkg3。

![](https://printlove.cn/posts/gobasic/images/11-3.png)

过程如下：

1. main 包执行 import pkg1。
2. pkg1 继续执行 import pkg2。
3. pkg2 继续执行 import pkg3。
4. pkg3 由于没有依赖其它包，所以向下执行常量、变量的初始化并执行 init 函数。
5. 接下来执行 pkg2、pkg1、main 包内的常量、变量初始化和执行 init 函数。
6. 最后开始执行 main 函数。

## 总结

熟悉了包的应用后，下来就要多熟悉熟悉常用包的使用，比如：

- fmt
- time
- strings
- regexp

等等...

当然也不是都要熟悉，等基础知识学完后，找个实际项目实战，看到哪个包就学哪个就够了。
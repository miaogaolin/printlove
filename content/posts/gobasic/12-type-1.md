---
title: "Go基础系列：12. 自定义类型和结构体 - 定义"
date: 2021-09-07T18:30:56+08:00
draft: false
categories: ["Go基础系列"]
tags: ["Go", "结构体"]
description: "自定义类型、结构体定义、匿名结构体、类型别名"
---

## 学到什么

1. 如何自定义类型？
2. 如何定义结构体？
3. 如何初始化结构体？
4. 如何嵌套结构体？
5. 如何定义匿名结构体？
6. 如何给类型取别名？
7. 如何定义结构体标签？

## 概念

什么是自定义类型？当 Go 语言中内置的类型，例如：int、string 等等，不能满足需求时，就可以自定义一个类型。

## 创建自定义类型

### 1. 基于内置类型

```go
type typeName baseType
```

- typeName 为定义的类型名称
- baseType 依赖的类型，Go 语言中所有的数据类型都可以，还有待会要讲的结构体 `struct`

举例，以下 3 个自定义的类型都依赖于内置类型。

```go
type str string

type num int

type m map[string]string
```

在上例中，虽然 `str` 类型依赖 `string` 类型，但在 Go 语言中是强类型语言，也就是这两个类型不能直接比较。

如果 `str` 和 `string` 类型相比较，就需要类型转化，自定义的其它类型都是这样。

```go
var s1 str = "new string"

// str 转化为 string 类型
s2 := string(s1)
```

### 2. 结构体

结构体是自定义类型中的复合类型，在这个类型中可以包含多个不同的数据类型。

定义了一个 `People` 类型的结构体，里面包含了两个类型字段。

```go
type People struct {
	// 字段
	*Name string*
	Age  int
}
```

当字段类型相同时，可以对相同的只声明一次。

```go
type StructName struct {
	Name string
	Age, Weight int
}
```

如果想把结构体中的字段写在一行，需要使用"英文分号"相隔，为了代码的结构清晰，这种一般不使用。

```go
type OneLine struct{Name string; Age, Weight int}
```

结构体中也可以不定义任何字段，即空结构体。

```go
type EmptyStruct struct {}
```

注意点：

- 使用 struct  关键字定义。
- struct 关键字后必须紧跟 “{”，即在同一行。

## 初始化结构体

定义好结构体后，下来就需要初始化值。

### 1. 带字段名称

```go
p1 := People{
	Name: "老苗",
	Age:  18,
}
```

给字段赋值时，也可以只设置一部分，也可以都不设置，没有设置的会按照默认值走。

```go
p := People{
	Age:  18,
}

exmaple := People{}
```

`Name` 默认为空字符串，`Age` 默认为 0。

### 2. 不带字段名称

在设置字段值时，可以不带字段名称，这时候就必须按照结构体字段顺序赋值。

```go
p2 := People{
	"老苗",
	18,
}
```

- 赋值时，不能进行部分省略。
- 带字段名称和不带字段名称不能混合。

## 访问结构体字段

使用“点”访问字段值和设置字段值

```go
p := People{"老苗", 18}

// 访问字段
fmt.Println(p.Name)

// 设置字段
p.Name = "潇洒哥"
```

## 结构体嵌套

在一个结构体中，可以嵌套另外一个结构体。这个特性在面向对象中，有点类似继承。

```go
type People struct {
	Name string
	Age  int
}

type Student struct {
	People
	Collect string
}
```

在 `Student` 结构体中，嵌套了 `People` 结构体。嵌套时，可以不需要设置字段名称，这时候默认的字段名称为嵌套类型名称。

### 1. 初始化

使用两种方式初始化 `Student` 结构体，一种是带字段名称，另一种是不带字段名称。

```go
// 第一种：带字段名称
s1 := Student{
	People: People{
		Name: "老苗",
		Age:  18,
	},
	Collect: "不告诉",
}

// 第二种：不带字段名称
s2 := Student{
	People{
		Name: "老苗",
		Age:  18,
	},
	"不告诉",
}
```

### 2. 访问嵌套结构体

在上面的例子中，`People` 结构体嵌入到 `Student` 结构体中，并且没有定义字段名称，这种情况获取 `People` 结构体中的字段就有两种方式。

第一种：访问不带字段名称，因为`People` 和 `Student` 结构体中的字段会变成同一级，结构体携带的方法（下篇讲解）也是一样。

```go
s2.Name
```

第二种：访问带字段名称，嵌入时不写字段名称，默认的字段名称就是嵌入类型名。

```go
s2.People.Name
```

### 3. 字段名相同

当被嵌入结构体与父级结构体字段名称相同时，编译器是可以通过的。例如 `RepeatStudent` 结构体中的`Name` 字段与 `People` 结构体中的 `Name` 字段名相同，这时候访问 `People` 结构体中的 `Name` 字段就必须带上结构体名称。

```go
type RepeatStudent struct {
	People
	Collect string
	Name string
}

r := RepeatStudent{
	People: People{Name: "老苗"},
	Name:   "潇洒哥",
}
fmt.Println(r.Name, r.People.Name)

// 输出
潇洒哥 老苗
```

## 匿名结构体

匿名结构体指的就是没有结构体名称，和匿名函数一样都没有名称。

```go
ano := struct {
   Name string
}{
   Name: "匿名",
}
```

该代码定义了一个匿名结构体并包含了一个字段，定义后再进行初始化。

在嵌套结构体时，也可以使用匿名结构体。

```go
type AnoStudent struct {
	People struct {
		Name string
		Age  int
	}
	Collect string
}
```

## 结构体标签

在定义结构体时，可以给字段写上标签，通过标签对结构体的进行自定义处理。

例如，使用标准包 "encoding/json" 转 json 字符串，通过标签可以声明将结构体字段转成对应的名称。

```go
type Tag struct {
	Name string `json:"name"`
}

t := Tag{"tag"}
b, _ := json.Marshal(t)
fmt.Println(string(b))

// 输出
{"name":"tag"}
```

使用反引号包裹标签，标签的规则要看处理方法或函数是如何定义的。如何获取标签，这里不做讲解。

## 类型别名

这个和自定义类型是不一样的，类型别名和原类型是完全等价的，不需要类型转化，只是名称不一样而已。

```go
type byte = uint8
```

在内置类型中，`byte` 类型就是 `uint8` 类型的别名。

## 总结

本篇讲解了如何自定义类型，并且对结构体详细的展开说明，千万要掌握，但还没有讲完，下篇讲解自定义类型如何携带方法。

当你学习过面向对象的语言知道了类的概念后，下来我将类和结构体的相似之处对比下。

- 类的属性 —- 结构体字段
- 类的方法 —- 结构体方法（下篇讲解）
- 类的继承 —- 结构体嵌套

这也是在改造面向对象的语言时，Go 语言的结构体被作为类的替代。
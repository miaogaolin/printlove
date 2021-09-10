
---
title: "Go基础系列：13. 自定义类型和结构体 - 方法 "
date: 2021-09-10T11:30:56+08:00
draft: false
categories: ["Go基础系列"]
tags: ["Go","结构体"]
description: "自定义类型和结构体如何携带方法？什么是值接收者？什么是指针接收者？等等等"
---

## 学到什么

1. 什么是方法？
2. 如何调用方法？
3. 什么是值接收者和指针接收者？
4. 如何使用 new 函数？
5. 什么是私有方法和公有方法？

## 概念

上篇学习了什么是自定义类型，对于结构体也是自定义类型的一种，那方法是什么？

如果一个函数属于一个自定义类型时，那它被称为方法，类似于面向对象中给类增加方法。

## 方法格式

在函数名前面写上自己所属的自定义类型后，这个函数就变为了该类型的方法。

```go
type People ... 

func (p *People) SetName(name string) string {
	 // ...
}
```

- 第一行自定义了一个类型，名为 `People`。
- `p *People` 确定了 `SetName` 函数属于`*People`类型，`p` 为类型的别名，也称为接收者。`p` 类似面向对象语言中的 `this` , `People` 类似”class 类“。
- 如果携带方法，自定义的类型不能为接口类型（`interface{}`）和 指针。

注：`*People` 前面的“星号”确定了接收者为指针类型，称为指针接收者，下面会讲。

## 方法名称

方法的名称在类型的所有方法名称和所有字段名称中必须是唯一的。就算相同的名称一个是字段一个是方法名也是不可以的。

```go
type People struct {
	Name string
}

func (p People) Name() string {
	return p.Name
}
```

以上代码错误，名称不唯一。

如果方法名称和类型名称相同是可以允许的。

## 方法调用

不管自定义的类型是基于内置类型还是结构体，都可以携带方法。

```go
// 内置类型
type Num int

func (n Num) String() string {
	return fmt.Sprintf("%d", n)
}

// 结构体
type People struct {
	Name string
	Age  int
}

func (p People) GetName() string {
	return p.Name
}
```

以上代码中定义了两个类型，每个类型分别携带了一个方法。

下来如何调用这两个方法：

```go
var n Num
n.String()

var p Peple
p.GetName()
```

先初始化好类型，然后再用“点”符号调用。

## 值接受者和指针接收者

### 1. 定义

在上面的代码中，是否注意到接收者类型有两种，一种是带星号（*People），一种是不带的（People 和 Num）。

**总结为**：

带星号的称为：指针接收者。

不带星号的的称为：值接收者。


还有一种特殊情况就是自定义的类型本身就是引用类型，就算接收者类型声明中带不带”星号“它也属于指针接收者。

```go
type M map[string]string

func (m M) SetKey(key, val string) {
	(m)[key] = val
}
```

因为 `M` 类型依赖的是 `map` 类型，`map` 本身就是一个引用类型，因此 `m` 为指针接收者。

### 2. 区别

如果方法是值接收者，执行方法时接收者会被拷贝一份，即使方法修改了接收者的值也不是原来的一份。

```go
func (p People) SetName(name string) string {
	p.Name = name
	return name
}
```

初始化 `People` 修改 `Name` 字段。

```go
p1 := People{Name: "苗"}
p1.SetName("潇洒哥")
fmt.Println(p1.Name)

// 输出
苗
```

发现了没，虽然调用了方法进行了修改，但还是不生效。因为 `p1` 和接收者 `p` 已经不是一个值了。如果想修改生效，只需把值接收者改为指针接收者。

```go
func (p *People) SetName(name string) string {
	p.Name = name
	return name
}
```

### 3. 调用时类型转化

在调用方法时，不管是值接收者还是指针接收者，调用时的变量类型是否是指针是不影响的。

例如：`People` 结构体的方法 `SetName` 不管是指针还是值接收者，以下代码都可以调用。

```go
// 值
p1 := People{}
p1.SetName()

// 指针
p2 := &People{}
p2.SetName()
```

至于为什么？当编译器发现你调用的变量（ p1 和 p2 ）类型和接收者的类型不相同时，也就是一个是指针一个不是，这个时候就会自动转化。

至于**接收者的值被方法修改时结果会不会改变，和调用变量的类型没关系。**

## New 函数使用

当初始化一个指针变量时，可以使用 "&" 符号，也可以使用 new 函数。

```go
new(T) 
```

例如，将 `p2 := &People{}` 修改。

```go
p2 := new(People)
p2.Name = "老苗"
```

`new(People)` 和 `&People{}` 等价。

## 私有和公有

方法名大写字母开头公有，小写字母开头私有。如果方法所在的包和调用者不是同一个，那私有方法是不能被调用的，只能调用公有方法。

私有方法只能在同一个包内被调用。

## 总结

本篇文章完了之后，自定义类型和结构体的知识点就讲完了，如果看到了这就给自己点个赞，坚持住！！！
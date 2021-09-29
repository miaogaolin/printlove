---
title: "Go基础系列：14. 指针类型"
date: 2021-09-15T18:24:56+08:00
draft: false
categories: ["Go基础系列"]
tags: ["Go","指针"]
description: "什么是指针？什么什么是指针类型？如何使用和创建指针类型变量？如何从指针变量中取值？如何传递指针？"
---

## 学到什么

1. 什么是指针？
2. 什么是指针类型？
3. 如何使用和创建指针类型变量？
4. 如何从指针变量中取值？
5. 如何传递指针？

## 什么是指针

先了解什么是内存地址？说通俗点就是电脑上数据存储位置的编号，就好比我们的身份证号一样。

指针也就是所说的内存地址，内存地址保存在指针变量里。

![](../images/14-1.png)

图解：图中左半部分是一个字符串数据，右半部分是指针变量，该指针变量存储了字符串数据的地址，图中的地址纯属虚构。

## 指针类型

指针类型是在任意类型前增加星号，格式如下：

```go
*BaseType
```

BaseType 代表任意类型。

例：

- `*int` 表示 `int` 类型变量的指针类型。
- `*string` 表示 `string` 类型变量的指针类型。

```go
type People struct {
	Name string
	Age  int
}
```

- `*People` 表示 `People` 类型变量的指针类型。

## 如何创建指针变量

现在创建一个 `*int` 指针类型的变量，格式如下：

```go
var p *int
```

`p` 是一个指针类型的变量，该变量还未初始化，现在给该变量初始化。

```go
var num int =  11

p = &num
```

使用 `&` 符号获取变量 `num` 的地址并赋值给指针变量 `p`。

输出指针变量信息，如下：

```go
fmt.Println(p)
// 输出
0xc00000a088
```

`0x` 开头说明是十六进制，该十六进制就是变量 `num` 的内存地址。

## 空指针

空指针表示指针变量没有任何赋值，此时空指针变量等于 `nil` 。

```go
var empty *int
fmt.Println(empty == nil) 

// 输出
true
```

> `nil` 类似其它语言中的 `null` ，在 Go 语言中只能和指针类型、接口类型进行比较，也只能给指针类型变量和接口类型变量赋值。

## 指针取值

声明了一个指针变量后，如果想从指针变量中取值那该如何做，指针的取值常常被称作**解引用**，格式如下：

```go
var num int =  11
var p *int

p = &num
// 取值
fmt.Println(*p)

// 输出
11
```

`*p` 表示从指针指向的变量`num`中取出值，取值时在指针变量前增加一个`*` 符号。

如果指针变量是空指针，再从中取值时，编译器会报错。

```go
panic: runtime error: invalid memory address or nil pointer dereference
```

### 结构体

如果指针变量是结构体指针类型时，获取结构体中的字段或调用方法时，无需在指针变量前增加`*` 。

```go
p := &People{
			Name: "老苗",
			Age:  18,
		}

fmt.Pringln(p)

fmt.Println(p.Name)
或
fmt.Println((*p).Name)

// 输出
&{老苗 18}
老苗
```

总结：

- 结构体指针输出的不是地址
- 调用结构体的字段或方法时无需添加`*`

### 方法

在[上篇文章](https://mp.weixin.qq.com/s/qvG621laIKxAPvspouZXZA)中已经接触到了指针接收者的概念，这块简单说明一下，详细的请看看[《自定义类型和结构体 - 方法》](https://mp.weixin.qq.com/s/qvG621laIKxAPvspouZXZA)。

如果通过方法想修改结构体中的字段时，可以将接收者设置为指针类型。

```go
// type/struct.go
// ...

func (p *People) SetName(name string) {
	p.Name = name
}

func main() {
	people := People{
		Name: "老苗",
	}
	people.SetName("潇洒哥")
	fmt.Println(people.Name)
}
// 输出
潇洒哥
```

`SetName`方法的接收者 `p` 为指针类型，修改了 `Name` 字段，`people` 变量的数据也随之更改。

## 指针传递

在 Go 语言中大部分的类型都是值传递，也就是说通过函数传值时，函数内的修改是不能影响外部的，如果想更改就使用指针类型。

```go
// pointer/function.go
// ...

func UpdateNum(num *int) {
	*num = 2
}

func main() {
	n := 1
	UpdateNum(&n)
	fmt.Println(n)
}

// 输出
2
```

`UpdateNum` 函数接受一个 `*int` 指针类型，形参 `num` 指针类型指向了实参变量 `n` ，因此对 `num` 的修改影响了变量 `n` 的值。

对于 Go 语言中的个别类型本身就是引用类型，不需要使用指针就可以在函数内部修改值而影响外部。

### 1. map 和 通道

这两个是引用类型，在传递时无需使用指针，通道在后续文章举例讲解。

```go
// pointer/map.go
// ...

func SetCountry(countries map[string]string) {
	countries["china"] = "中国"
}

func main() {
	c := make(map[string]string)
	SetCountry(c)
	fmt.Println(c)
}

// 输出
map[china:中国]
```

该代码初始化了一个 `map` 类型，然后通过 `SetCountry` 函数修改其值。

### 2. 切片

在了解[《内置集合 - 切片》](https://mp.weixin.qq.com/s/DQ76zYtBhswj4ARB0LbQAw)这篇文章后应该明白切片的底层引用的是数组，在切片传递时不会改变底层数组的引用，但如果对切片进行追加操作后，数组引用就会改变。

```go
// pointer/slice.go
//...

func AppendAnimals(animals []string) {
	animals = append(animals, "老虎", "大象")
}

func main() {
	input := []string{"猴子"}
	AppendAnimals(input)
	fmt.Println(input)
}

// 输出
[猴子]
```

`AppendAnimals`函数给切片追加元素，但外部的变量 `input` 的值不受影响，因为 `append` 操作后底层数组会进行拷贝并改变引用。

如果在函数内想影响 `input` 变量，就使用指针解决。

```go
// pointer/slice.go
//...

func AppendAnimalsPointer(animals *[]string) {
	*animals = append(*animals, "老虎", "大象")
}

func main() {
	input := []string{"猴子"}
	AppendAnimalsPointer(&input)
	fmt.Println(input)
}

// 输出
[猴子 老虎 大象]
```

在传递切片时如果只修改切片内容，即不追加元素，原切片数据将会受到影响，因为底层数组的引用没有改变。

```go
// pointer/slice.go
//...

func UpdateAnimals(animals []string) {
	for i := range animals {
		animals[i] = "兔子"
	}
}

func main() {
	updateInput := []string{"老虎", "大象"}
	UpdateAnimals(updateInput)
	fmt.Println(updateInput)
}

// 输出
[兔子 兔子]
```

`UpdateAnimals` 函数修改了切片内容，通过输出可以看出 `updateInput` 变量数据已改变。

## 总结

指针可以节省复制的开销，但同时要考虑解引用和垃圾回收带来的影响，所以不要把使用指针作为性能优化的首选方案。
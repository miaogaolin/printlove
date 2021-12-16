---
title: "Go基础系列：15. 接口"
date: 2021-09-18T17:51:56+08:00
draft: false
categories: ["Golang"]
tags: ["Go","接口"]
description: "什么是接口？如何定义接口？如何使用接口？如何嵌入接口？接口与接口之间如何赋值？如何推断接口的实际类型？如何使用空接口？"
series: ["Go基础系列"]
---
## 学到什么

1. 什么是接口？
2. 如何定义接口？
3. 如何使用接口？ 
4. 如何嵌入接口？
5. 接口与接口之间如何赋值？
6. 如何推断接口的实际类型？
7. 如何使用空接口？

# 概念

接口是通过定义抽象方法来约定实现者的规则，概念和其它语言中有点类似，但对于 Go 语言中接口的实现与接口之间耦合性更低，灵活性更高。

为了通俗的理解接口的概念，我举个例子，"假如你受女娲之托让你进行造人的工作，但给你制定了造人的要求，要有吃喝的动作，但具体每个人怎么吃怎么喝那无所谓，只要有了这两个动作就表示你造人成功"。

这个例子中女娲制定的要求就是接口，你按照造人的要求去做就称作接口的实现。

> 也不知道讲明白了没，保佑你可以。

## 定义

现在定义一个 `People` 的接口，并定义吃喝两个动作。

```go
type People interface {
  // 可不写参数名：Eat(string) error
	Eat(thing string) error
	Drink(thing string) error
}
```

- `Eat` 和 `Drink` 方法不需要具体实现。
- 方法前不需要 `func` 关键字。
- 方法的参数名称和返回名称可以不写。

定义后就可以直接声明一个该接口类型变量。

```go
var p People
```

`p` 变量没有初始化，此时值为 `nil` 。

## 实现接口

接口实现的工作是交给自定义类型的，自定义类型实现了接口所有的方法，就实现接口了。

```go
type LaoMiao struct {
	Name string
	Age  int
}

func (l LaoMiao) Eat(thing string) error {
	fmt.Println("在公司偷吃" + thing)
	return nil
}

func (l LaoMiao) Drink(thing string) error {
	fmt.Println("在公司偷喝" + thing)
	return nil
}
```

- `LaoMiao` 实现了 `People` 接口中的所有方法，就说明实现了该接口。
- 无需使用其它语言中 `implements` 关键字显示的去实现。
- 可同时实现多个接口。

再看张图，可能就更清晰了，如下：

![](../images/15-1.png)

图中“实现者”都包含了 `A` 和 `B` 接口的方法，那它都实现了这两个接口。

## 接口的使用

实现了接口之后，就可以将该类型的实例化赋值给接口类型。

```go
var p People = LaoMiao{}
p.Eat("桃子")

// 输出
在公司偷吃桃子
```

`p` 为接口类型，实际的实现是 `LaoMiao` 类型。

你可能好奇，我为啥不直接调用呢，类似如下：

```go
m := LaoMiao{}
m.Eat("桃子")
```

上面代码没有使用 `People` 接口类型，但如果我再定义一个类型去实现 `People` 接口，好处就体现出来了。

```go
type LaoSun struct {
	Name string
	Age  int
}

func (l LaoSun) Eat(thing string) error {
	fmt.Println("在车上吃" + thing)
	return nil
}

func (l LaoSun) Drink(thing string) error {
	fmt.Println("在车上喝" + thing)
	return nil
}
```

又增加了一个类型去实现，看清楚这个是 `LaoSun` ，上面的那个类型是 `LaoMiao` 。

现在开始想个问题，如果我想调用这两个类型的方法，并且调用的代码只写一遍，该如何做？喘口气，我告诉你，自然是用接口。

```go
// interface/main.go
// ...

func Run(p People) {
	thing1, thing2 := "桃子", "可乐"
	p.Eat(thing1)
	p.Drink(thing2)
}

func main() {
	Run(LaoMiao{})
	Run(LaoSun{})
}

// 输出
在公司偷吃桃子
在公司偷喝可乐
在车上吃桃子
在车上喝可乐
```

该代码增加了一个 `Run` 函数，该函数接受的类型为接口类型，`main` 函数中将两个实现接口的类型传递给函数。

### 接收者类型与接口

在上面的代码中所有实现接口的类型接收者都是值类型，例如：

```go
func (l LaoSun) Eat(thing string) error {
	// ...
}
```

接收者`l`类型为 `LaoSun` ，如果是指针接收者应该为 `*LaoSun` 。

在使用接口类型调用时，接口接受的类型为值类型，例如：

```go
Run(LaoSun{})
```

该函数的参数 `LaoSun{}` 为值类型，但其实也可以传递指针类型 `Run(&LaoSun{})` ，编译器会进行解引用。

如果接收者为指针类型时，那给接口传值时必须使用指针类型，例如：

```go
type GouDan struct {
   Name string
   Age  int
}

func (l *GouDan) Eat(thing string) error {
	fmt.Println("你管我吃" + thing)
	return nil
}

func (l *GouDan) Drink(thing string) error {
	fmt.Println("你管我喝" + thing)
	return nil
}
```

重新定义了一个类型去实现 `People` 接口并且方法的接收者为指针类型，如果给接口传递值类型时，编译器会报错。

```go
Run(GouDan{})

// 输出
cannot use GouDan{} (type GouDan) as type People in argument to Run:
	GouDan does not implement People (Drink method has pointer receiver)
```

正确的是，只能传递指针类型。

```go
Run(&GouDan{})
或
var sun *LaoSun = &LaoSun{}
Run(sun)
```

## 接口嵌入

一个接口可以包含另外一个接口，例如：

```go
type Student interface {
   People
   Study()
}
```

- 定义了一个 `Student` 接口，对于学生接口自然也会有吃喝的动作，因此无需重复定义，只需要将 `People` 接口嵌入就可以。
- 如果自定义类型想实现 `Student` 接口，需要将嵌入接口定义的方法和自己所定义的方法都需要实现。
- 可嵌入多个接口。

### 接口与接口赋值

在上面的代码中 `People` 接口被嵌入到了 `Student` 接口 ，那这个时候，`Student` 接口类型变量就可以赋值给 `People` 类型变量。

![](../images/15-2.png)

例：

```go
var stu Student
	
var pl People = stu
```

如果把 `People` 类型不被嵌入，而只是让 `Student` 接口包含其方法，那上面接口与接口赋值也是允许的。

```go
type Student interface {
	Eat(thing string) error
	Drink(thing string) error
	Study()
}
```

总结：**大接口包含了小接口的方法，那大接口就可以赋值给小接口。**

## 空接口

空接口表示没有定义任何抽象方法，如下：

```go
type Empty interface {}
```

`Empty` 类型现在就是空的接口，它可以接受任意类型。

```go
var str Empty = "字符串"

var num Empty = 222
```

平常项目中使用时，为了更简单，其实无需定义空接口，直接使用 `interface{}` 作为类型。

```go
var str interface{} = "字符串"

var num interface{} = 222
```

总结一句：**所有类型都实现了空接口，即空接口可以接受任意类型变量**。

## 类型推断

在一个接口变量中，如果想知道该接口变量的具体实现类型是谁就需要使用类型推断。

### 1. 接口转实现者

```go
v := var1.(T)
```

- `T` 表示你需要推断的类型。
- `v` 为转化后类型为 `T` 的变量。
- `var1` 可以为空接口。

例：

```go
var people People

// 将 People 类型转化为 LaoMiao 值类型
people = LaoMiao{}
val := people.(LaoMiao)

// 将 People 类型转化为 LaoMiao 指针类型
people = &LaoMiao{}
peo := people.(*LaoMiao)
```

从例子中可以看出，接口变量中存储的类型和推断时的类型必须相同，如果不相同时，编译器会报错。

```go

people = LaoMiao{}
// 报错
val := people.(*LaoMiao)

// 正确
val := people.(LaoMiao)
```

### 2. 是否可推断

如果接口变量中存储的实际类型不确定，那就必须进行判断，如果不判断时出现无法推断的情况，编译器就会报错。

```go
v, ok := var1.(T)
```

判断其实就是在推断类型时多增加了一个返回值，如果可推断 `ok` 值为 `true`，否则为 `false` 。

```go
people = LaoMiao{}

val1, ok := people.(*LaoMiao)
fmt.Println(ok)

val2, ok := people.(LaoMiao)
fmt.Println(ok)

// 输出
false
true
```

### 3. type-switch

这个知识点其实在很早之前的[《流程控制》](/posts/gobasic/6-流程控制/)一篇中讲过了，我再讲一遍并补充。

```go
var data interface{}
data = "111"

// data 是接口类型， .(type) 获取实际类型
// 将实际类型的值赋给 d 变量
switch d := data.(type) {
case string:
    // 进入分支后，d 是 string 类型
    fmt.Println(d + "str")
case int:
    // 进入分支后， d 是 int 类型
    fmt.Println(d + 1)
}

// 输出
111str
```

- 通过 `.(type)` 获取接口的实际类型，记住这种方式只能用于 `switch` 语句中，这也是我为什么单独在这块讲解。
- 不能使用 `fallthrough` 关键字。
- 如果只是判断类型，则无需使用 `d` 变量接受。

## 总结

Go 语言的接口知识点就讲完了，很重要，务必要掌握清楚。那现在问问你知道接口的实现精髓是啥吗？

我总结下，只要实现了其方法就实现了接口，实现的方法如果满足了多个接口，那就都实现。
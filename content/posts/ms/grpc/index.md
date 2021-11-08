---
title: "深入微服务：1. 开篇 gRPC 环境&启动"
date: 2021-11-08T16:48:56+08:00
draft: false
categories: ["深入微服务"]
tags: ["gRPC"]
description: "gRPC 的环境搭建及入门使用"
---

从这篇开始，《深入微服务》系列就开始了，该系列从微服务的“应用”与“原理”两条线路进行推进，让咱大家伙明白微服务内部到底是个啥。好了不吹牛了，烂尾就打脸了。

该篇代码：

[https://github.com/miaogaolin/gofirst/tree/main/example/helloworld](https://github.com/miaogaolin/gofirst/tree/main/example/helloworld)

## 学到什么

1. 什么是 gRPC ?
2. 什么是 Protobuf ?
3. 如何搭建 gRPC 环境？
4. 如何应用 gRPC ?

## 什么是 gRPC

gRPC 是基于 Http/2 协议的开源远程过程调用系统。

远程过程调用，即 RPC (Remote Procedure Calls) ，它实现了像本地一样调用远程的方法，而不考虑底层的具体实现细节。

而为了远程调用时数据传输的更高效，选择了 Protobuf，平常我们使用较多的就是 JSON、XML。

## gRPC 调用模型

![](1.png)

一个完整的调用过程如下：

1. 假如客户端 (Client) 调用服务端 (Server) 上的 A 方法，则发起 RPC 调用。
2. 对请求信息使用 Protobuf 进行对象序列化压缩。
3. 服务端接收到请求后，解码请求体，进行业务逻辑处理并返回。
4. 对响应结果使用 Protobuf 进行对象序列化压缩。
5. 客户端接受到服务端响应，解码请求体，并唤醒正在等待 A 方法响应的客户端调用。

## 什么是 Protobuf

Protobuf (Protocol buffers) 和 Go 都是一个亲妈，来自于 Google。它用于序列结构化数据，提供了一种相比 XML、JSON 格式，会更小、更快、操作更简单的方法。

先简单对比下。

**JSON**

```JSON
{
  "name": "laomiao",
  "id": 1,
  "email": "2825873215@qq.com"
}
```

**Protobuf**

```protobuf
message Person {
  string name = 1;
  int32 id = 2;
  string email = 3;
}
```

该信息存储于后缀为 `proto` 的文件中，它只提供格式，而不存储数据。在使用时，用 Protobuf 编译工具将该文件编译成你所使用的语言。

例如，在 Go 语言中，会根据该信息生成编译后的 Go 文件，`message Person` 会对应到 `struct Person` 上，并提供了序列化结构体的方法。

本篇不会详细讲解 Protobuf 定义语法，只会把用到的进行简单描述，详细的前往：

[https://developers.google.com/protocol-buffers/docs/proto3](https://developers.google.com/protocol-buffers/docs/proto3)

## 编译工具

将 Proto 文件编译成 Go 代码需要两个工具：

- protoc 工具，c++ 语言实现。
- protoc-gen-go 插件，go 语言实现，给 protoc 工具提供插件，生成 go 代码。

gRPC 系统也要基于 Proto 文件生成相关代码，因此还需要一个工具：

- protoc-gen-go-grpc  插件，go 语言实现，配合上面两个工具。

下来开始安装这些工具。

## protoc 工具安装

### 1. 下载

地址：[https://github.com/protocolbuffers/protobuf/releases](https://github.com/protocolbuffers/protobuf/releases)。

根据自己的系统选择对应的版本，我这块选择了 Win64。

![](2.png)

### 2. 环境变量

先解压，将整个目录放置到你想要的位置，再把 bin 目录加入环境变量，完成后在控制台输入命令。

```bash
$ protoc --version
libprotoc 3.15.8
```

成功搞定！

## 插件安装

```protobuf
go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.26
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.1
```

安装完成后，会在 $GOPATH/bin 目录下生成两个文件，记得这个目录也要加入环境变量。

## 编写 Proto

创建 "helloword.proto" 文件。

```protobuf
syntax = "proto3";

option go_package = "github.com/miaogaolin/gofirst/example/helloworld";

// The greeting service definition.
service Greeter {
  // Sends a greeting
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

// The request message containing the user's name.
message HelloRequest {
  string name = 1;
}

// The response message containing the greetings
message HelloReply {
  string message = 1;
}
```

解释如下：

- 第一行，proto3 声明版本号为 3，不写时，默认版本为 2。
- go_package 定义包路径。
- Greeter 为 rpc 服务，远程调用的方法为 SayHello。
- HelloRequest 用于 SayHello 方法参数。
- HelloReply 用于 SayHello 方法返回。
- name 和 message 后的数字 1 是给字段分配的唯一编号，如果新增加字段就给分配 2、3、4 等等。

## 生成代码

工具装好、proto 文件编写好，下来就开始使用工具生成代码。

```bash
protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
    helloworld.proto
```

- go_out：生成 go 文件（不含 rpc 代码）的输出目录。
- go_opt=paths=source_relative：生成的 go 文件和 proto 源文件在同一目录，如果 go_out 定义为其它目录，该设置无效。
- go-grpc_out：rpc 的 go 文件输出目录。
- go-grpc_opt=paths=source_relative：生成 rpc 的 go 文件和 proto 源文件在同一目录，如果 go-grpc_out 定义为其它目录，该设置无效。

运行后，会在当前目录下产生两个文件：

- helloworld.pb.go：数据类型代码。
- helloworld_grpc.pb.go：rpc 相关代码，其中会产生 `GreeterClient` 和 `GreeterServer` 两个接口，一会要实现。

## 远程调用

要实现 gRPC 的远程调用，就要分别实现 “客户端” 和 “服务端” 代码，下来我会给出关键性代码的说明，完整的前往 Github。

### 1. 服务端

```go
// example/hellworld/server/main.go

// 实现服务端 GreeterServer 接口
type server struct {
  // 必须嵌套
	// 包含了 GreeterServer 接口其它方法实现
	pb.UnimplementedGreeterServer
}

// 远程调用方法的具体逻辑
func (s *server) SayHello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
	 log.Printf("Received: %v", in.GetName())
	 return &pb.HelloReply{Message: "Hello " + in.GetName()}, nil
}

func main() {
	// 监听端口，用于接受客户端的请求
	lis, err := net.Listen("tcp", port)
	
	...

	// 服务端实例化
	s := grpc.NewServer()
	// 将具体的实现注册到服务端
	pb.RegisterGreeterServer(s, &server{})

	// 阻塞等待
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
```

主线流程：

1. 监听端口；
2. 实例化服务端；
3. 将具体实现进行注册；
4. 阻塞等待。

### 2. 客户端

实现好了服务端，下来客户端只需要远程调用就行。

```go
// example/hellworld/client/main.go

func main() {
   // 连接服务端
   // grpc.WithInsecure() 跳过安全验证，即明文传输
   // grpc.WithBlock() 等待与服务端握手成功
   conn, err := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock())
  
	 ...

   // 客户端实例化
   c := pb.NewGreeterClient(conn)

	 ...

   // 连接超时设置
   ctx, cancel := context.WithTimeout(context.Background(), time.Second)
   defer cancel()

   // 远程调用
   r, err := c.SayHello(ctx, &pb.HelloRequest{Name: name})
   if err != nil {
      log.Fatalf("could not greet: %v", err)
   }
	 // 返回消息
   log.Printf("Greeting: %s", r.GetMessage())
}

```

主线流程：

1. 连接服务端；
2. 实例化客户端；
3. 开始调用；
4. 获取返回消息。

### 3. 运行

先执行服务端代码，再执行客户端代码。

**服务端**

```bash
$ go run main.go
2021/11/04 11:28:19 server listening at [::]:50051
```

**客户端**

```bash
$ go run main.go
2021/11/04 11:30:17 Greeting: Hello world
```

客户端接收到了服务端的响应，一切完成！

## 参考

* gPRC 官网：[https://grpc.io/docs/languages/go/quickstart/](https://grpc.io/docs/languages/go/quickstart/)
* gRPC 应用：[https://segmentfault.com/a/1190000019608421](https://segmentfault.com/a/1190000019608421)
* gRPC 超时限制：[https://www.cnblogs.com/jiujuan/p/13499915.html](https://www.cnblogs.com/jiujuan/p/13499915.html)
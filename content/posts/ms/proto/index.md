---
title: "深入微服务：3. Protobuf 为啥比 JSON、XML 牛？"
date: 2021-11-19
draft: false
categories: ["深入微服务"]
tags: ["Protobuf"]
description: "Protobuf 的实现原理，并说明 JSON、XML 的不同支持"
---

大家好，我是 “潇洒哥老苗”。

今天，我带大家更深层次的认识认识 Protobuf，如果你对 Protobuf 的用法还不熟悉，直接前往：[https://developers.google.com/protocol-buffers/docs/proto3](https://developers.google.com/protocol-buffers/docs/proto3)。

当对 Protobuf 有了基本的认识后，就会明白了 Protobuf 序列化的数据会比 JSON、XML 传输效率更高。

那为啥会高呢？本篇就带着这个问题一探究竟。

## 看表面

对于 JSON、XML，为了便于数据传输时的可阅读性，会保留数据的结构化信息，举个 JSON 例子，如下：

```json
{
  "name": "laomiao",
  "age": 18
}
```

当发送该信息时，接受方收到后就会明白，这是个 “key/value” 形式的数据，并且"name" 后是姓名，"age" 后是年龄。

那如何压缩该数据呢？

我们可以删除 “花括号”、“name”、“age” 以及其它的 “冒号”、“逗号”、“引号” 等结构数据。

```powershell
laomiao18
```

那这样删除了，接收方怎么知道，哪个是姓名？哪个是年龄？

### 删除 ”结构“

只需要发送方和接收方都保留这份数据的 ”结构“ 就行，发送方只发送数据，接收方接收到数据后，根据本地保留的 ”结构“ 去解析数据就 OK。

假设，该 "结构" 如下，这不是真实存在的，只是为了方便给大家描述。

```go
{
  name string 7
  age int 1
}
```

通过该 ”结构“ 就可以知道：

- name 数据在 age 数据之前。
- name 数据类型为 string，age 数据类型为 int。
- name 数据字节长度为 7，age 数据字节长度为 1。

接收方只需要拿着这份 ”结构“ 就知道了 "laomiao18" 数据如何解析。

### 自描述

但这样还是有这些问题：

1. name 数据如果超过 7 个字节怎么办？
2. age 数据超过 1 个字节怎么办？
3. 结构中的顺序不能调整，太死了，怎么办？

当然，发送方和接收方都更新下自己的 ”结构“ 数据，但这样显然不现实，因为数据你不能保证是固定长度。

对于 age 数据，我们可以定义为 4 个字节或 8 个字节，只要可以应对自己的业务即可。但这样还是有问题，空间浪费？

假如，age 定义为 4 个字节，传输的数据为 18，而对于 18 这个数字，只需要 1 个字节就足以了，而剩下 3 个字节都浪费着。但咱又不能定义为 1 个字节，因为有可能会有大数。

那如何压缩 age 数据呢？

对于 Protobuf，会在数据中加入解决以上问题的信息，即数据自己描述自己，简称 ”自描述“。

总结下 Protobuf 做了哪些？如下：

- 数据中加入 ”字段“ 顺序的信息。
- 数据中加入类型信息。
- 最小化压缩整形数据。

## Protobuf

Protobuf 在序列化数据时，将 Protobuf 数据类型总共划分为 6 大类，英文称为 "wire type"。

| wire type | proto 类型 | 含义 |
| --- | --- | --- |
| 0 | int32, int64, uint32, uint64, sint32, sint64, bool, enum | Varint |
| 1 | fixed64, sfixed64, double | 64-bit |
| 2 | string, bytes, embedded messages, packed repeated fields | Length-delimited |
| 3 | groups (废弃) | Start group |
| 4 | groups (废弃) | End group |
| 5 | fixed32, sfixed32, float | 32-bit |

"wire type" 中的 ”3“ 和 ”4“ 类型已废弃，这块不做讲解。

下来通过一个 message 信息展开说明，如下：

```protobuf
message HelloRequest {
  string name = 1;
  int32 num = 2;
  float height = 3;
  repeated int32 hobbies= 4;
}
```

这就好比我上面所说的 ”结构“，发送方和接收方就是通过该结构去解析数据。现在我们就针对上面留下的问题一一说明。

### 1. 类型和顺序

那传输的数据中如何保存 ”数据类型“ 和 ”顺序“？

数据类型对应到 "wire type"，顺序对应到 ”field number“。假如 `int32 num = 2` 对应如下：

- wire type：0，通过上面表格对应。
- field number：2，字段后的唯一编码。

将这两个信息按照如下公式组装：

```plaintext
(field_number << 3) | wire_type
```

带入得：

```plaintext
(2 << 3) | 0 
→ 16
```

### 2. Varint

对于 num 字段保存的数据如何如何压缩？假如 num 存储的数据为 300。按照 4 字节存储如下：

```plaintext
00000000 00000000 00000001 00101100
```

从结果可以看到，真实有效的数据只有 2 字节，为了压缩，面对不同的数据大小会占用不用的字节数。

那如何记录数据长度？我们可以再增加一个字节去记录真实数据所占用的实际字节数。对于 300 数据，增加一个字节记录长度，那下来和数据一块总共需要 3 个字节。那还有什么办法再减少字节数吗？

当然会有呀，不然我就说了一堆废话，咱继续。

请出 Varint 算法，过程如下：

- 将数据以 7 位为一组进行分割；
- 将组的顺序颠倒，即：将 ”高位 → 低位“ 规则，改为 ”低位 → 高位“；
- 识别每一组，如果该组后还有数据，就在该组前增加一位 ”1”，否则增加 “0”。

将数据 300 带入该算法，过程如下：


```plaintext
300: 00000000 00000000 00000001 00101100
→ 7 位分割：0000 0000000 0000000 0000010 0101100
→ 颠倒顺序：0101100 0000010 0000000 0000
→ 组前加 1/0：10101100 00000010
→ 十进制：172 2
```

按照这套算法下来，将数据压缩为 2 个字节存储。而接收方拿到字节数据后，只需要按照高位识别，如果为 0，说明之后没有数据了。

最终，对于 `int32 num = 2` 结构和数据 300，压缩后的结果为：

```plaintext
16 172 2
```

### 3. Length-delimited

现在说说 `string name = 1` ，该类型对应的 "wire type" 为 2，"field number" 为 2。记录 “顺序” 和 “类型” 方式和上面讲的一样。

重点说说数据如何记录，相比 Varint 算法，该类型就简单多了，只需要使用 Varint 算法记录数据的字节长度。

假如，name 的值为 "miao"，最终结果为：

```plaintext
10 4 109 105 97 111
```

解释：

- 10：`(2 << 3) | 2` 。
- 4：字符串长度。
- 之后：按照 "UTF-8" 编码保存。

对于 message 嵌套、repeated (数组或切片)、字节数组，也是按照该算法得到。

例如，`repeated int32 hobbies= 4` ，假设 hobbies 数据为 `[10, 20]`，最终结果为：

```plaintext
34 2 10 20
```

### 4. 浮点数

针对浮点类型，就更简单了，浮点数据使用固定字节保存，记录 “顺序” 和 “类型” 依然是上面讲的。

假如，`float height = 3` ，该类型对应的 "wire type" 为 5，数据假设为 52.1，最终结果为：

```plaintext
29 102 102 80 66
```

解释：

- 29：`(3 << 3) | 5` 。
- 之后：使用固定字节数 4。

如果使用了双精度，那对应的 "wire type" 为 1，数据占用字节数为 8。

### 5. sint32/sint64

这两个类型不知道你在写 proto 文件时有没有用到，明白这个很重要，不然有时候数据就不能起被到压缩的作用。

上面讲到的 Varint 算法中，我们知道了以 7 位一组，再增加一位 “识别位” 来起到压缩数据的作用。但存在一个问题，倘若存在负数时，那这种压缩方式就失效了。

至于为啥？如何解决的？

我先说结果，如果写 proto 文件时，设置的数据类型为 sint32 或 sint64 时，将采用 ZigZag 算法进行数据压缩。

ZigZag 算法我就不重复讲解了，直接看[上一篇](https://mp.weixin.qq.com/s/7ZzbCiPnYHh8d-pmqzXvNw)。

## 小结

学完本篇我们知道了 Protobuf  怎么做到了压缩数据。简单说下，就是删除一些没用的信息，采用自描述的方式记录 “类型”、“顺序”、“数据”。

而对于类型，只记录了 "wire type"，该类型确定了数据的大概处理方式。

那说它就一定比 JSON、XML 好吗？也不是。

因为要采用 Protobuf 方式传输数据，发送放和接收方必须采用同一套结构规则，也可以说 “协议”。所以，如果想提高数据的阅读性，降低这种规则的配合，就可以使用 JSON、XML。

后面我会使用 Go 语言实现 Protobuf 序列化和反序列化的核心算法，只要这样我才觉得真的明白了该算法的真谛。

可持续关注该项目：[https://github.com/miaogaolin/gofirst](https://github.com/miaogaolin/gofirst)，该[系列](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzIzNzQwNTQwNg==&action=getalbum&album_id=2126863251039633410&scene=173&from_msgid=2247484609&from_itemidx=1&count=3&nolastread=1#wechat_redirect)的所有代码往后都会加入进去。

## 参考

- 官网算法讲解：[https://developers.google.com/protocol-buffers/docs/encoding](https://developers.google.com/protocol-buffers/docs/encoding#simple)
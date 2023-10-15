<div align="center">

# ⚡ Turbowarp ClipX

中文 | [English](/docs/en.md)
#### 📦 Turbowarp 高效开发扩展插件

</div>

## 简介
Turbowarp ClipX 是一个高效开发部署turbowarp扩展的插件, 提供:
- ✨ **更好的接口风格** 使用类和装饰器来定义扩展，更简洁和优雅
- ⚡  **便捷的缓存功能** 提供缓存功能, 优化性能 (可在接口中自定义)
- 🔨 **更好的开发环境** 自动补全Turbowarp类型
- 📦 **webpack 压缩** 缩小打包JS文件体积, 提高加载速度和性能 
- 🎃 **注册异常检测** 注册扩展时检查异常情况并拦截汇报
- 🎉 **Typescript 支持** 提供更好的类型检查和自动补全功能
- 🍎 **ESLint 修复** 自动格式化代码, 保持统一的风格和规范
- 🎉 **Action 自动打包** 使用action实现自动打包并加入release中, 方便在线获取
- ⚡ **CLI 自动翻译** 通过命令行无需配置参数即可进行i18n翻译

## 开发
入口 **/src/index.ts** (**javascript**同理)
1. 初始化安装依赖 (**yarn** **pnpm**同理, 推荐**pnpm**)
    ```shell
    npm install
    ```
2. dev
    ```shell
    npm run dev
    ```
3. eslint 修复
    ```shell
   npm run lint
    ```
4. 翻译
    ```shell
    npm run i18n
    ```
5. 打包
    > webpack 打包生成的js文件位于 **dist/extension.js**
    ```shell
    npm run build
    ```

## 接口

**TurboWarp 扩展接口规范** 更多前往 [TurboWarp 中文文档](https://docs.turbowarp.cn/development)
1. `id`是表示此扩展使用的唯一id的字符串应该只包含字符a-z和0-9 **(同一个扩展应该始终使用相同的ID，因为更改它会破坏现有项目)**
2. `name`是一个字符串，告诉Scratch在侧栏中显示什么名称
3. `color1`是一个hex格式的颜色，将设置为扩展的方块颜色
4. `blocks`是定义扩展包含哪些积木的对象列表 
   - `opcode`是积木的内部名称，也对应于积木运行时默认将调用的方法*_(可选`func`覆盖调用的方法名, 已弃用)_
     - **opcode不应该被更改**
   - `blockType` 定义积木的类型
       - `reporter` 圆形的带返回值的积木
       - `Boolean` 六边形的返回布尔值的积木
       - `command` 一个键积木
       - `hat` 响应事件积木
   - ✨ `bind` 接受一个**function**, 允许异步执行返回Promise
   - ✨ `cache` 缓存
     - `enable` 是否开启缓存
     - `expiration` 缓存时间, 单位秒, 如果为**0**则永不过期
   - ✨ `text` 是一个字符串，用于定义积木在编辑器中的名称 格式为 **[参数:类型]**
     - `参数` 定义积木接受的参数的对象, 可能将在`default`和`menu`字段中引用
     - `类型`定义要创建的输入形状 *(不区分大小写)*
         - `STRING` 字符串类型
         - `NUMBER` 用于数字输入
         - `BOOLEAN` 用于布尔输入 **(默认值将被忽略)**
         - `ANGLE` 用于角度
         - `COLOR` 颜色类型(hex格式, *如#fff*)
         - `MATRIX` 5x5矩阵（以11101010101…字符串格式传递）
         - `NOTE` 用于音乐
   - `default` 是参数的初始值, 接受一个字典, 键对应`参数`, 值对应参数的`默认值`
   - `menu` 如果有参数需选择多个给定的值, 则可加入至此参数, 接受一个字典, 键对应`参数`, 值对应多个给定的值的列表类型, 将生成下拉菜单
   - `disableMonitor` 是否积木强制删除复选框来创建监视器, 适用类型为**REPORTER** *(带返回值的积木)*, 如果为真, 则删除变量左处的复选框
5. `docsURI` 对应文档链接
6. ✨ `debug` 是否开启控制台调试 (默认关闭, 即此插件本身不会有任何输出)
7. ✨ `uptime` 定期缓存清理时间间隔, 单位秒, 默认为**60**秒
8. ✨ `i18n` i18n 翻译
   - `source` 源语言，默认为简体中文
   - `accept` 目标语言列表，默认为英语和简体中文

没太看懂? 下面展示一个示例
```typescript
import Extension from './include/plugin'

new Extension({
    id: "ExampleExtension",
    name: "example",
    color1: "#0800ff",
    blocks: [
        {
            opcode: 'output',
            blockType: 'command',
            text: '命令 [block:string] [type:string]',
            default: { block : "参数2", type: "类型" },
            menu: { block : [ "参数1", "参数2" ] },
            bind: function({ block, type }) {
                return `内容 ${block} 类型 ${type}`;
            },
        }, {
            opcode: 'list',
            blockType: 'reporter',
            text: '获取一个空列表',
            bind: () => [],
            disableMonitor: true,
        },
    ]
}).register();
```
上文创建并注册了一个扩展**ExampleExtension**, 并在Scratch中显示为**example**, 方块颜色#0800ff, 并创建了两个方块:

第一个方块*output*的类型为**键积木**, 共有两个参数
1. `block`参数是一个下拉菜单, **字符串**类型, 默认值为`"参数2"`, 可选值为 *参数1*和*参数2*
2. `type`参数是一个输入框, **字符串**类型, 默认值为`"类型"`<br>
绑定一个方法返回`内容 {{block}} 类型 {{type}}`<br>
通过设置`disableMonitor`为真来强制删除复选框

第二个方块*list*的类型为**带返回值的积木**, 方法返回一个空列表

![示例图片](/docs/example.png)

## 为什么要写此插件

举一个非常简单的例子

> 原生 turbowarp

```typescript
class Extension {
    public getInfo() {
        return {
            id: 'FetchExtension',
            name: 'fetch',
            color1: '#00c4ff',
            blocks: [
                {
                    opcode: 'fetchReq',
                    // @ts-ignore
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'fetch [uri] 方法[method]',
                    arguments: {
                        uri: {
                            // @ts-ignore
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'https://example.com/',
                        },
                        method: {
                            // @ts-ignore
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'GET',
                        },
                    }
                },
            ],
            menus: {
                method: [
                    "GET", 
                    "POST", 
                    "PUT", 
                    "DELETE",
                ],
            },
        };
    }

    fetchReq({ uri, method }): Promise<any> {
        return fetch(uri, {
            method: method,
        });
    }
}
// @ts-ignore
Scratch.extensions.register(new Extension());
```

> turbowarp-clipx

```typescript
import Extension from "./plugin";

new Extension({
    id: 'FetchExtension',
    name: 'fetch',
    color1: '#00c4ff',
    blocks: [
        {
            opcode: 'fetch',
            blockType: 'reporter',
            text: 'fetch [uri:string] 方法[method:string]',
            default: { uri: "https://example.com/" , method: "GET" },
            menu: { method: ["GET", "POST", "PUT", "DELETE" ] },
            bind: ({ uri, method }): Promise<any> => fetch(uri, { method, }),
        },
    ]
}).register();
```

实际上, 出于文档大小考虑, 这里只节选了一个方块的扩展示例, 那如果是做一个[云数据库](https://gitee.com/LinwinSoft/open-data-api/blob/master/40code/extension.ts)扩展呢? 更大的代码量, 在接口和方法上反复穿行...

所以结合了这一现状, 此插件借鉴Django路由的传参方式设计了更好的接口风格, 此插件的接口代码量仅占约原生的**30~45%**.


## Release 自动打包发布
仓库密钥配置 `TOKEN` 为你的 [GitHub Token](https://github.com/settings/tokens/new), 当发布Release时, 会自动触发事件打包发送.

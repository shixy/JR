JR
==

一个简单的javascript 富客户端框架。
整个项目是一个SPA项目(Single Page Application),以一个独立页面为入口，作为载体，其他的功能页面通过Ajax异步加载形成一个完整的系统。
该框架主要是对整个项目的javascript进行统一管理及责任划分。

JR.core.js
    框架核心。主要功能有：
        1.定义MVC层各层的基类
        2.监控url的hash值的变化，实现页面的动态加载，可实现Ajax的前进后退
        3.根据模块自动加载模块所用到的js，无需页面引入
JR.conf.js
    项目的核心配置文件。主要配置各层对应的文件夹的相对目录、url与模块方法的匹配(类似于java  struts1的struts-config.xml配置文件)
models
    模型层。server端的数据接口，或者是对本地存储的操作接口。
servies
    基于model层，根据项目需要对model层获取到的源数据进行一些逻辑处理
views
    tmpl 基于jquery.tmpl.js的一些模板
    view 每个功能页面的事件的绑定，方法的执行
controllers
    调度中心，通过它来通知需要展现哪一个view

    整个框架执行过程：
    装载JR.core.js,JR.confg.js -> url#hash改变 -> 扫描JR.conf.js -> 找到对应的controller及method ->  加载使用到的view，并执行
    view的相关方法 -> 加载使用到的service -> 调用service方法 -> 加载使用到的model -> 调用model方法

   所以的js文件只会自动加载一次
## 移动端豆瓣电影
### 一、简介
本项目要实现移动端仿豆瓣电影的单页应用，利用豆瓣提供的豆瓣电影API实现以下功能：
1. 展示豆瓣评分排名前250的电影
2. 展示北美电影排行榜
3. 提供搜索电影功能，将搜索到的相关的电影展示出来
4. 页面上所展示的电影条目都可以通过点击跳转到豆瓣电影的详细介绍
### 二、准备工作
* 豆瓣电影API：[豆瓣电影](https://developers.douban.com/wiki/?title=movie_v2)（PS：豆瓣电影API公开版只提供部分功能，只包括：电影条目信息、影人条目信息、电影条目搜索、Top250和北美票房榜）
* 使用HTML、CSS实现的页面基本样式
### 三、设计思路
页面主要分为两大部分：展示部分以及底部的可点击切换（footer）部分，其中展示部分分为三个section，分别展示Top250、北美排行以及搜索电影，在用户点击底部（footer）部分的不同部分时会切换到相应的页面。  
<img src="https://raw.githubusercontent.com/wky0615/MarkdownPhotos/master/doubanmovie/%E9%A1%B5%E9%9D%A2.png" width="50%">   
首先，要实现点击footer部分的各个icon实现section的切换，通过绑定'click'事件可以轻松实现。  
其次，要实现Top250部分功能，通过AJAX获取豆瓣电影API提供的数据，获取数据后利用jQuery操作DOM将数据拼接后在页面上展示，需要注意的是250条数据并非一次性全部加载完成，考虑到流畅性，每次请求获取的信息条目为20条。  
<img src="https://raw.githubusercontent.com/wky0615/MarkdownPhotos/master/doubanmovie/Top250-1.png" width="50%">   
数据格式如上图，图Top250-1展示前20条数据   
<img src="https://raw.githubusercontent.com/wky0615/MarkdownPhotos/master/doubanmovie/Top250-2.png" width="50%">  
图Top250-2展示具体电影条目中所包含的信息，包括导演、主演、电影海报及评分等    
随后，实现北美电影排行的展示与Top250部分思路及方法大同小异，只不过由于提供的电影条目数据不多，请求数据时一次性获取全部条目。  
最后，实现搜索电影功能，此部分需要将用户在 ``` <input> ```标签中输入的内容作为AJAX请求中的data传递，随后将获取的数据拼接后放置在页面上。 
### 四、效果演示
移动端请扫描下方二维码   
![](https://raw.githubusercontent.com/wky0615/MarkdownPhotos/master/doubanmovie/%E4%BA%8C%E7%BB%B4%E7%A0%81.png)
### 五、实现流程
下图为Top250部分实现功能的流程，主要是两个部分的实现，一个是获取数据后将数据拼接为DOM再放置在页面上，另一个是判断页面是否滚动到底部并且是否已经获取了全部的数据。   
<div align="center">
  <img src="https://raw.githubusercontent.com/wky0615/MarkdownPhotos/master/doubanmovie/top250%E6%B5%81%E7%A8%8B%E5%9B%BE.png">
</div>    
下图为北美排行的功能实现流程，需要注意的是由于请求获得的数据数量较少，因此只需一次请求完所有的数据。    
<div align="center">
  <img src="https://raw.githubusercontent.com/wky0615/MarkdownPhotos/master/doubanmovie/%E5%8C%97%E7%BE%8E%E6%8E%92%E8%A1%8C%E6%B5%81%E7%A8%8B%E5%9B%BE.png">
</div>    
下图为搜索功能的实现流程，重点是将用户输入的信息作为AJAX的data发送，以此来获取数据。   
<div align="center">
  <img src="https://raw.githubusercontent.com/wky0615/MarkdownPhotos/master/doubanmovie/search%E6%B5%81%E7%A8%8B%E5%9B%BE.png">
</div>    

### 六、问题及解决
##### 判断页面滚动到底部、页面滚动到底部多次触发发送请求的问题
在Top250功能中，一次发送请求获得20条数据，无法在视窗一次性完全展示，必然会出现滚动条，在用户滚动到最底部时，触发下一次请求并展示加载动画。
* 判断页面滚动到底部的方法：通过比较页面此时的高度和视窗高度+视窗滚动的高度判断页面是否到达底部，即使用 ``` .height() ``` 方法获得页面和视窗的高度，使用 ``` .scrollTop() ``` 获得视窗滚动的高度```$('section').eq(0).height() - 20 <= $('main').scrollTop() + $('main').height()```。本项目中留出20px的冗余。
* 在判断页面是否滚动到底部时留出了20px的冗余，在用户继续滚动的情况下，会出现多次触发发送请求的情况，解决这个问题有两种方法，
* 一：函数节流，在发送请求的函数之外添加一个定时器，使得请求在固定的延时之后再发送。
```
function loadData(){
  if(timer){
    clearTimeout(timer)
  }
  timer = setTimeout(function(){
    $('.loading').show()
    $.ajax({
    url: 'https://api.douban.com/v2/movie/top250',
    type: 'GET',
    data: {
      start: index,
      count: 20
    },
    dataType: 'jsonp'
  }).done(function(ret){
    console.log(ret)
    createNode(ret)
    index+=20
    console.log(index)
    }).fail(function(){
    console.log('error')
    })
  }, 500)
}
```
* 二：加锁，添加初始值为false的变量isLoading，在请求发送前将isLoading的值改为true，不管请求成功或失败都将其值改为false，并在绑定事件中判断isLoading的值
```
//加锁
var isLoading = false
function loadData(){
  if(isLoading) return
  isLoading = true
  $('.loading').show()
  $.ajax({
    url: 'https://api.douban.com/v2/movie/top250',
    type: 'GET',
    data: {
      start: index,
      count: 20
    },
    dataType: 'jsonp'
  }).done(function(ret){
    console.log(ret)
    createNode(ret)
    index+=20
    console.log(index)
  }).fail(function(){
    console.log('error')
  }).always(function(){
    isLoading = false
    $('.loading').hide()
  })
}
```

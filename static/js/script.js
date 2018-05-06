var hander = {
  createNode:function(movie){
    var genres = movie.genres.join(' / ');
    var template = `<div class="item">
                      <a href="${movie.alt}">
                        <div class="cover">
                          <img src="${movie.images.medium}" alt="cover">
                        </div>
                      </a>
                      <div class="detail">
                        <a href="${movie.alt}"><h3>${movie.title}</h3></a>
                        <div><span class="score">${movie.rating.average}</span>分 / <span class="collect">${movie.collect_count}</span>收藏</div>
                        <div><span class="year">${movie.year} / </span><span class="type">${genres}</span></div>
                        <div class="directors">导演：
                          <a href="${movie.directors[0].alt}">
                            <img src="${movie.directors[0].avatars.small}">
                            <span class="director">弗兰克.德拉邦特</span>
                          </a>
                        </div>
                        <div class="casts">
                          主演：
                          <div class="casts-content"></div>
                        </div>
                      </div>
                    </div>`

    var $node = $(template)
    var arr = movie.casts
    arr.forEach((val,index)=>{
      if(val.avatars){
        var templateChlid = `
                              <a href="${val.alt}">
                                <span class="actor">
                                  <img src="${val.avatars.small}">${val.name}
                                </span>
                              </a>
                            `
      }
      $node.find('.casts-content').append($(templateChlid))
    })
    return $node
  }
}

var handler = {
  createNode: function(movie){
    var template = `<div class="item">
                      <a href="#">
                        <div class="cover">
                          <img src="https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p480747492.webp" alt="cover">
                        </div>
                        <div class="detail">
                          <h3></h3>
                          <div><span class="score"></span>分 / <span class="collect"></span>收藏</div>
                          <div><span class="year"></span> / <span class="type"></span></div>
                          <div>导演：<span class="director"></span></div>
                          <div>主演：<span class="actor"></span></div>
                        </div>
                      </a>
                    </div>`
    var $node = $(template)
    $node.find('a').attr('href', movie.alt)
    $node.find('.cover img').attr('src', movie.images.medium)
    $node.find('.detail h3').text(movie.title)
    $node.find('.detail .score').text(movie.rating.average)
    $node.find('.detail .collect').text(movie.collect_count)
    $node.find('.detail .year').text(movie.year)
    $node.find('.detail .type').text(movie.genres.join(' / '))
    $node.find('.detail .director').text(function(){
      var dirArr = []
      movie.directors.forEach(function(dir){
        dirArr.push(dir.name)
      })
      return dirArr.join(' / ')
    })
    $node.find('.detail .actor').text(function(){
      var actorArr = []
      movie.casts.forEach(function(actor){
        actorArr.push(actor.name)
      })
      return actorArr.join(' / ')
    })
    return $node
  }
}
var top250 ={
  init:function(){
    this.$container = $('.top250')
    this.$viewport = $('main')
    this.index = 0
    this.isLoading = false
    this.isFinish = false
    this.start()
    this.event()
  },
  start:function(){
    this.getData((data)=>{
      this.render(data)
    })
  },
  event:function(){
    this.start()
    this.$viewport.scroll(()=>{
      if(!this.isFinish && (this.$container.height() <= this.$viewport.height() + this.$viewport.scrollTop() + 20)){
        this.start()
      }
    })
  },
  getData:function(callback){
    if(this.loading) return
    this.loading = true;
    this.$container.find('.loading').show()
    $.ajax({
      url:'https://api.douban.com/v2/movie/top250',
      type:'GET',
      data:{
        start:this.index,
        count:20,
      },
      dataType:'jsonp'
    }).done((res)=>{
      console.log(res)
      this.$container.find('.loading').hide()
      this.loading = false
      this.index += 20;
      if(this.index >= res.total){
        this.isFinish = true
      }
      callback && callback(res)
    }).fail(()=>alert('服务器挂了'))
  },
  render:function(data){
    data.subjects.forEach(val=>{
      this.$container.find('#top250').append(hander.createNode(val))
    })
  }

}

var us ={
  init:function(){
    this.$container = $('.us')
    this.$viewport = $('main')
    this.index = 0
    this.isLoading = false
    this.isFinish = false
    this.start()
  },
  start:function(){
    this.getData((data)=>{
      this.render(data)
    })
  },
  getData:function(callback){
    if(this.loading) return
    this.loading = true;
    this.$container.find('.loading').show()
    $.ajax({
      url:'https://api.douban.com/v2/movie/us_box',
      type:'GET',
      data:{
        start:this.index,
        count:20,
      },
      dataType:'jsonp'
    }).done((res)=>{
      console.log(res)
      this.$container.find('.loading').hide()
      this.loading = false
      this.index += 20;
      if(this.index >= res.total){
        this.isFinish = true
      }
      callback && callback(res)
    }).fail(()=>alert('服务器挂了'))
  },
  render:function(data){
    data.subjects.forEach(val=>{
      this.$container.find('#us').append(hander.createNode(val.subject))
    })
  }
}

var search ={
  init:function(){
    this.$container = $('.search')
    this.$btn = $('.search .search-btn')
    this.$content = $('.search .search-content')
    this.loading = false
    this.event()
  },
  event:function(){
    var _this =this
    this.$content.on('keypress',function(event){
      if(event.keyCode == 13){
        _this.getData(_this.$content.val(),function(data){
          console.log(_this.$content.val())
          _this.render(data)
        })
      }
    })
    this.$btn.on('click',function(){
      _this.getData(_this.$content.val(),function(data){
        console.log(_this.$content.val())
        _this.render(data)
      })
    })
  },
  getData:function(keyword,callback){
    if(this.loading) return
    this.loading = true;
    this.$container.find('.loading').show()
    $.ajax({
      url:'https://api.douban.com/v2/movie/search',
      type:'GET',
      data:{
        q:keyword
      },
      dataType:'jsonp'
    }).done((res)=>{
      console.log(res.subjects)
      this.$container.find('.loading').hide()
      this.loading = false
      callback && callback(res)
    }).fail(()=>console.log('error'))
  },
  render:function(data){
    console.log(data.subjects)
    this.$container.find('.result').html('')
    data.subjects.forEach(val=>{
      this.$container.find('.result').append(handler.createNode(val))
    })
  }
}

var app ={
  init:function(){
    this.$tabs = $('footer li')
    this.$main = $('main')
    this.$section = $('main > section')
    this.event()
    top250.init()
    us.init()
    search.init()
  },
  event(){
    var _this = this
    this.$tabs.on('click',function(){
      var index = $(this).index()
      $(this).addClass('active').siblings().removeClass('active');
      _this.$section.eq(index).addClass('active').siblings().removeClass('active');
      _this.$main.scrollTop(0);
    })
  }
}

app.init()

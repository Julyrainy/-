window.onload = function (){
  const container = document.getElementsByClassName('container')[0];
  const pre = document.getElementsByClassName('right')[0];
  const next = document.getElementsByClassName('left')[0];
  const list = document.getElementsByClassName('list')[0];
  const button = document.getElementsByClassName('button');
  const buttons = document.getElementsByClassName('buttons')[0];
  list.style.left = -600 + 'px';
  let index = 1;
  let timer;
  const changetime = 3000; // 图片自动播放切换时间
  const time = 300; // 一次位移切换的总时间
  const interval = 10; // 相邻两次位移间隔的时间
  let animating = false; // 防止多次点击使得动画来不及响应，当进行animate的时候不允许点击事件
  // 获取list当前left值的兼容性写法的写法，其实此处没必要写这个
  function getStyle(dom,style){
    return dom.currentStyle?dom.currentStyle.style:window.getComputedStyle(dom,null)[style];
  }

  // 主要的动画函数，控制图片的滚动行为
  function animate(offset){
    animating = true;
    let left = parseInt(list.style.left) + offset; // 图片最终位置
    const speed = offset / (time/interval); // 每次位移移动的距离
    // 该函数实现翻页动画效果
    function go(){
      const currentleft = parseInt(list.style.left);
      // 若图片位置还未到达终点，则继续递归调用
      if((speed < 0 && currentleft > left) || (speed > 0 && currentleft < left)){
        list.style.left = parseInt(getStyle(list,'left')) + speed + 'px';
        setTimeout(go,interval);
      }
      // 若图片已到达终点，则查看图片是否为备用图片，若是则充值图片位置
      else{
        if(parseInt(list.style.left) < -3000){
          list.style.left = -600 + 'px';
        }
        if(parseInt(list.style.left) > -600){
          list.style.left = -3000 + 'px';
        }
        animating = false // 将动画开关设为关闭
      }
    }
    go();
  }

  // 将被选中小圆点变色，同时取消之前被选中小圆点的变色
  function showButton(){
    for(let i = 0;i<button.length;i++){
      if(button[i].className === 'button on'){// 取消前一状态下小圆点的类 on
        button[i].className = 'button';
        break;
      }
    }
    button[index-1].className = 'button on';
  }

  // 根据点击事件，跳转到对应图片
  function buttonChoose(event){
    // 若点击的不是小圆点，则忽视该事件
    if(event.target.tagName.toLowerCase()!== 'span'){
      return;
    }
    const myindex = event.target.getAttribute('index');
    if(myindex === index || animating){
      return;
    }
    animate((myindex-index)*-600);
    index = myindex;
    showButton();
  }
  // 调用animate方法的同时改变触发对应小圆点
  function runAnimate(offset){
    if(animating){
      return;
    }
    animate(offset);
    index = offset > 0 ? --index : ++index;
    if(index<1){
      index = 5;
    }
    if(index>5){
      index = 1;
    }
    showButton();
  }
  // 自动播放方法，鼠标不在container上时候触发
  function play(){
    // timer = setTimeout(function(){runAnimate(-600);play();},changetime);
    timer = setInterval(function(){runAnimate(-600);},changetime);
  }
  // 当鼠标移动到container上时候停止滚动
  function stop(){
    if(timer){
      clearInterval(timer);
    }
  }
  // 为左箭头右箭头添加了响应时间
  pre.addEventListener('click',function(){runAnimate(600)},false);
  next.addEventListener('click',function(){runAnimate(-600)},false);
  // 事件委托，确定用户点击的是哪个小圆点用以跳转
  buttons.addEventListener('click',buttonChoose,false);
  // 控制轮播图自动轮播和停止轮播的事件
  container.addEventListener('mouseout',play,false);
  container.addEventListener('mouseover',stop,false);
  play();
  showButton();
}

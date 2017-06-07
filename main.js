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
  let animating = false;
  // 获取list当前left值的兼容性写法的写法
  function getStyle(dom,style){
    return dom.currentStyle?dom.currentStyle.style:window.getComputedStyle(dom,null)[style];
  }

  // 主要的动画函数，控制图片的滚动行为
  function animate(offset){
    animating = true;
    let left = parseInt(list.style.left) + offset;
    const speed = offset / (time/interval); // 每次位移移动的距离
    function go(){
      const currentleft = parseInt(list.style.left);
      if((speed < 0 && currentleft > left) || (speed > 0 && currentleft < left)){
        list.style.left = parseInt(getStyle(list,'left')) + speed + 'px';
        setTimeout(go,interval);
      }
      else{
        if(parseInt(list.style.left) < -3000){
          list.style.left = -600 + 'px';
        }
        if(parseInt(list.style.left) > -600){
          list.style.left = -3000 + 'px';
        }
        animating = false
      }
    }
    go();
  }

  // 将被选中小圆点变色，同时取消之前被选中小圆点的变色
  function showButton(){
    for(let i = 0;i<button.length;i++){
      if(button[i].className === 'button on'){
        button[i].className = 'button';
        break;
      }
    }
    button[index-1].className = 'button on';
  }

  // 根据点击事件，跳转到对应图片
  function buttonChoose(event){
    if(event.target.tagName.toLowerCase()!== 'span'){
      return;
    }
    const myindex = event.target.getAttribute('index');
    if(myindex === index){
      return;
    }
    if(animating){
      console.log("bye");
      return;
    }
    animate((myindex-index)*-600);
    index = myindex;
    showButton();
  }
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
    timer = setTimeout(function(){runAnimate(-600);play();},changetime);
  }
  // 当鼠标移动到container上时候停止滚动
  function stop(){
    if(timer){
      clearTimeout(timer);
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

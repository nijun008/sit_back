var config = {
  updateDuration: 60,             // 更新完成时间 单位：分钟
  completedExit: false,           // 更新完成是否退出
  initProg: 1,                    // 初始进度
  ui: 'auto'                      // 更新界面类型
}

window.onload = () => {
  if (isMobile()) {
    document.getElementById('control').style.display = 'none'
    document.getElementById('mobile-tips').style.display = 'block'
  } else {
    var update = new Update(config)
  }
}

function isMobile(){
  var userAgent = navigator.userAgent,Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"]
  return Agents.some((i) => {
    return userAgent.includes(i)
  })
}

/**
 * @param { object } config 配置
 */
 class Update {
  constructor(config) {
    const { updateDuration = 60, completedExit = false, initProg = 1, wrapperId = 'windows' } = config
    this.updateDuration = updateDuration
    this.completedExit = completedExit
    this.initProg = initProg  // 初始进度
    this.prog = initProg      // 当前进度
    this.progTimer = null     // 更新定时器
    this.controlWrapper = document.getElementById('control')  // 控制层
    this.uiWrapper = document.getElementById(wrapperId)       // 界面层el
    this.cursorEl = document.getElementById('footer-tips')    // 鼠标el

    this.progEl = document.getElementById('prog')             // 进度el
    this.controlEl = document.getElementById('control-btn')   // 控制el

    this.controlEl.addEventListener('click', () => {
      if (this.isFullScreen()) {
        this.init()
      } else {
        this.startUpdate()
      }
    })

    window.onresize = () => {
      var isFull = this.isFullScreen()
      if (isFull) {
        this.startUpdate()
      } else {
        this.init()
      }
    }
  }

  // 初始化
  init() {
    clearInterval(this.progTimer)
    this.prog = this.initProg
    this.progEl.innerHTML = this.prog
    this.controlEl.innerHTML = '更 新'
    this.cursorEl.style.cursor = 'default'
    this.uiWrapper.style.display = 'none'
    this.controlWrapper.style.display = 'block'

    this.controlEl.style.visibility = 'visible'

    if (this.isFullScreen()) {
      this.exitFullscreen()
    }
  }
  // 开始
  startUpdate() {
    if (!this.isFullScreen()) {
      this.fullScreen()
    }
    this.controlEl.innerHTML = '结 束'
    this.cursorEl.style.cursor = 'none'

    this.controlWrapper.style.display = 'none'
    this.uiWrapper.style.display = 'block'
    this.controlEl.style.visibility = 'hidden'

    clearInterval(this.progTimer)
    this.progTimer = setInterval(() => {
      this.prog ++
      if (this.prog >= 100) {
        this.prog = this.initProg
        if (this.completedExit) {
          clearInterval(this.progTimer)
          this.exitFullscreen()
          return
        }
      }
      this.progEl.innerHTML = this.prog
    }, Math.ceil(this.updateDuration * 60 * 1000 / 100))
  }
  // 进入全屏
  fullScreen(ele) {
    var element = ele || document.body
  
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen()
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    }
  }
  // 退出全屏
  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
  // 是否全屏
  isFullScreen() {
    return  !!(
      document.fullscreen || 
      document.mozFullScreen ||                         
      document.webkitIsFullScreen ||       
      document.webkitFullScreen || 
      document.msFullScreen 
   )
  }
}
var config = {
  updateDuration: 30,             // 更新完成时间 单位：分钟
  completedExit: false,           // 更新完成是否退出
  initProg: 5,                    // 初始进度
  wrapperId: '',                  // 更新界面容器id
  viceScreen: 'off'               // 副屏模式
}

window.onload = () => {
  if (isMobile()) {
    document.getElementById('control').style.display = 'none'
    document.getElementById('mobile-tips').style.display = 'block'
  } else {

    var update = new Update(config)

    var radioParent = document.getElementById('radio-box')

    radioParent.addEventListener('click', function (e) {
      var el = e.target
      var tagName = el.tagName.toLowerCase()
      if (tagName === 'input') {
        config[el.name] = el.value
        update.setUiWrapper()
      }
    })

  }
}

function isMobile() {
  var userAgent = navigator.userAgent,Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"]
  return Agents.some((i) => {
    return userAgent.includes(i)
  })
}

function isMac () {
  return navigator.userAgent.toLowerCase().indexOf('mac') > -1
}

/**
 * @param { object } config 配置
 */
 class Update {
  constructor(options) {
    const { completedExit = false, initProg = 1 } = options
    this.defaultWrapper = isMac() ? 'mac' : 'windows'

    this.completedExit = completedExit
    this.initProg = initProg  // 初始进度
    this.prog = initProg      // 当前进度
    this.progTimer = null     // 更新定时器
    this.controlWrapper = document.getElementById('control')  // 控制层
    this.cursorEl = document.getElementById('footer-tips')    // 鼠标el
    this.progEl = document.getElementById('prog')             // windows进度el
    this.progBar = document.getElementById('prog-bar')        // mac进度条el

    this.controlEl = document.getElementById('control-btn')   // 控制el
    this.setUiWrapper()

    this.controlEl.addEventListener('click', () => {
      if (this.isFullScreen()) {
        this.exitUpdate()
      } else {
        this.enterUpdate()
      }
    })

    window.onresize = () => {
      var isFull = this.isFullScreen()
      if (isFull) {
        this.enterUpdate()
      } else {
        this.exitUpdate()
      }
    }
  }

  exitUpdate() {
    switch(config.viceScreen) {
      case 'off':
        this.init()
        break
      case 'on':
        this.showWrapper()
      default:
        break
    }
  }

  enterUpdate() {
    switch(config.viceScreen) {
      case 'off':
        this.startUpdate()
        break
      case 'on':
        this.hideWrapper()
      default:
        break
    }
  }

  hideWrapper () {
    document.body.style.backgroundColor = '#000'
    this.controlWrapper.style.display = 'none'
    if (!this.isFullScreen()) {
      this.fullScreen()
    }
  }

  showWrapper () {
    document.body.style.backgroundColor = '#fff'
    this.controlWrapper.style.display = 'block'
    if (this.isFullScreen()) {
      this.exitFullscreen()
    }
  }

  setUiWrapper() {
    this.uiWrapper = document.getElementById(config.wrapperId || this.defaultWrapper)
  }

  // 初始化
  init() {
    clearInterval(this.progTimer)
    document.body.style.backgroundColor = '#fff'
    this.prog = this.initProg
    this.progEl.innerHTML = this.prog
    this.progBar.style.width = this.prog + '%'
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
    document.body.style.backgroundColor = '#000'
    this.controlEl.innerHTML = '结 束'
    this.cursorEl.style.cursor = 'none'

    this.controlWrapper.style.display = 'none'
    this.uiWrapper.style.display = 'block'
    this.controlEl.style.visibility = 'hidden'
    this.progEl.innerHTML = this.prog
    this.progBar.style.width = this.prog + '%'

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
      this.progBar.style.width = this.prog + '%'
    }, Math.ceil(config.updateDuration * 60 * 1000 / 100))
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
      document.msFullScreen  ||
      (document.body.clientHeight === window.screen.height)
   )
  }
}
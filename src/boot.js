import {
  Vue,
  VueRouter,
  VueResource,
  Vuex
} from './lib'
import app from './app'
import {
  preLoadResource,
  setContentMinHeight,
  setCurrentRoute,
  reselectHeaderNav,
  setRouter,
  showLoading,
  hideLoading,
  getConfig,
  setRequestAnimation
} from './utils'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(Vuex)

setRequestAnimation()

const router = new VueRouter({
  root: '',
  linkActiveClass: 'active',
  hashbang: true
})
setRouter(router)

function boot(store, routes) {
  var config = getConfig()
  store = new Vuex.Store(store)
  router.map(routes)

  preLoadResource(function() {
    router.start(Vue.extend({
      components: {
        app
      },
      data: () => ({
        config: config,
        ubasePaperDialog: {},
        ubasePropertyDialog: {},
        ubaseDialog: {},
        popDialog: {}
      }),
      ready(){
        Vue.nextTick(function(){
          Vue.broadcast = router.app.$broadcast.bind(router.app)
        });
      },
      store: store
    }), document.getElementsByTagName('main')[0])


  }, routes)
}

Vue.mixin({
  ready: function() {
    var self = this
    var vuex = this.$options.vuex
    if (vuex && vuex.getters) {
      var $body = $('body')
      setContentMinHeight($body.children('main').children('article'))
      hideLoading()
    }

    // emapcard的事件綁定
    $(this.$el).on('click', '.card-opt-button', function(e) {
      var row = $(this).data('row');
      var event = $(this).attr('data-event');
      if(row && event){
        self.$emit(event, row);
      }
    })
  }
})

router.afterEach(function(transition) {
  setCurrentRoute(transition.to.path.substr(1))
  showLoading()

  // 主菜单切换时， 隐藏内容区域，切换后的菜单内容组件渲染完成后会自动显示出来
  $('body>main>article>*').css('display', 'none')
  Vue.nextTick(function() {
    $('.bh-paper-pile-dialog').remove()
    $('.sc-container').removeClass('bh-border-transparent bh-bg-transparent')
    var $body = $('body')
    $body.children('[bh-footer-role=footer]').removeAttr('style')
    setContentMinHeight($body.children('main').children('article'))
    reselectHeaderNav()
    setTimeout(function() {
      $body.children('main').children('article[bh-layout-role=navLeft]').children('section').css('width', 'initial')
    }, 10)
    try {
      $('.jqx-window').jqxWindow('destroy')
    } catch (e) {
      //
    }
  })

})

export default boot

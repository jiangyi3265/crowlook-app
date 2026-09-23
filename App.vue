<script>
import { hydrateContent } from './lib/content'

export default {
  onLaunch() {
    hydrateContent()
  },
  onShow() {
    hydrateContent()
  }
}
</script>
<style>
@font-face{font-family:crow-icons;src:url("/static/ui/vant-icons.woff2") format("woff2");font-weight:normal;font-style:normal;font-display:block}
/* #ifdef H5 */
html,body{scrollbar-width:none}::-webkit-scrollbar{display:none;width:0;height:0}
/* #endif */
page{background:#fff;color:#111;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",Arial,sans-serif}
button::after,uni-button::after{border:none!important}button:focus-visible,uni-button:focus-visible{outline:2px solid #f000ce;outline-offset:-3px}view,button,uni-view,uni-button{box-sizing:border-box}
.capsule-action::after,.playback-button::after,.service-button::after,.tab::after{border:0!important}
</style>

if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');


var AFAppX = self.AFAppX.getAppContext
  ? self.AFAppX.getAppContext().AFAppX
  : self.AFAppX;
self.getCurrentPages = AFAppX.getCurrentPages;
self.getApp = AFAppX.getApp;
self.Page = AFAppX.Page;
self.App = AFAppX.App;
self.my = AFAppX.bridge || AFAppX.abridge;
self.abridge = self.my;
self.Component = AFAppX.WorkerComponent || function(){};
self.$global = AFAppX.$global;
self.requirePlugin = AFAppX.requirePlugin;
        


function success() {
require('../../app');
require('../../components/uni-popup/uni-popup?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/order-list/OrderList?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../pages/user?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/change?hash=9c196a44b404a424cd853079b60f3a94d9436c46');
require('../../pages/confirm?hash=9c196a44b404a424cd853079b60f3a94d9436c46');
require('../../pages/recorder?hash=8b066981b12214a693150636abc36a75a00af925');
require('../../pages/flow?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/diacrisis?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/set-meals?hash=9c196a44b404a424cd853079b60f3a94d9436c46');
require('../../pages/recharge?hash=9c196a44b404a424cd853079b60f3a94d9436c46');
require('../../pages/set-password?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/change-pwd?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/web-view?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/help?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/more?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/more-web?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/login?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/certification?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/activity?hash=9c196a44b404a424cd853079b60f3a94d9436c46');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}
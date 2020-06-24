import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  // 此项目要做: 下拉刷新 和 上拉加载更多, 所以url会复用.  提取成属性
  url = "http://101.96.128.94:9999/data/product/list.php";

  res: Res; //只有属性 才可以在前端HTML中显示!

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private http: HttpClient
  ) {
    this.initializeApp();
  }

  initializeApp() {
    // 类似于 jQuery的:  $(document).ready(function(){});
    // 代表 监听当前页面 加载就绪的时机  然后执行 xxx
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // 发送请求:
      this.http.get(this.url).subscribe((res: Res) => {
        console.log(res);
        this.res = res;
      });
    });
  }

  // 触底时触发
  loadData(event) {
    console.log("触底");

    let url = this.url + "?pno=" + (this.res.pno + 1);
    this.http.get(url).subscribe((res: Res) => {
      console.log(res);
      // 加载更多: 合并新的内容到旧的内容中
      // concat:  合并数组, 并返回新数组
      res.data = this.res.data.concat(res.data);

      this.res = res;

      // 固定写法: 告诉加载更多组件, 此次加载更多操作已完成. 可以进行下一次了.
      event.target.complete();
    });
  }

  // 下拉刷新触发:
  doRefresh(event) {
    console.log("下拉刷新");

    this.http.get(this.url).subscribe((res: Res) => {
      // 把第一页的数据 覆盖之前的
      this.res = res;

      event.target.complete();
    });
  }
}

// interface 和 class 关键词 是同级别的. 不可以互相包含!
interface Data {
  is_onsale: string;
  lid: string;
  pic: string;
  price: string;
  sold_count: string;
  title: string;
}

interface Res {
  pageCount: number;
  pageSize: number;
  pno: number;
  recordCount: number;
  data: Data[]; //代表 数组类型, 数组中的元素都是Data类型
}

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
  url = "https://api.apiopen.top/getImages";

  res: Res;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private http: HttpClient
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.http.get(this.url).subscribe((res: Res) => {
        console.log(res);

        this.res = res;
      });
    });
  }

  doRefresh(event) {
    this.http.get(this.url).subscribe((res: Res) => {
      this.res = res;

      event.target.complete();
    });
  }

  loadData(event) {
    this.http.get(this.url).subscribe((res: Res) => {
      res.result = this.res.result.concat(res.result);

      this.res = res;

      event.target.complete();
    });
  }
}

interface Result {
  id: number;
  img: string;
  time: string;
}

interface Res {
  code: number;
  message: string;
  result: Result[];
}

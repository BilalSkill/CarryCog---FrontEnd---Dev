import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loadAPI: Promise<any>;
  title = 'carryCogClientApp';
  constructor() { 
  //   this.loadAPI = new Promise((resolve) => {
  //     this.loadScript();
  //     resolve(true);
  // });
  }
  ngOnInit() {
    
  } 
   public loadScript() {        
    var isFound = false;
    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
        if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("loader")) {
            isFound = true;
        }
    }

    if (!isFound) {
        var dynamicScripts = ["./assets/js/jquery.js","./assets/js/moment.js","./assets/js/bootstrap.js","https://maps.googleapis.com/maps/api/js?key=AIzaSyDYeBBmgAkyAN_QKjAVOiP_kWZ_eQdadeI&callback=initMap&libraries=places"
        ,"./assets/js/owl-carousel.js"
        ,"./assets/js/blur-area.js"
,"./assets/js/icheck.js"
,"./assets/js/gmap.js"
,"./assets/js/magnific-popup.js"
,"./assets/js/ion-range-slider.js"
,"./assets/js/sticky-kit.js"
,"./assets/js/smooth-scroll.js"
,"./assets/js/fotorama.js"
,"./assets/js/bs-datepicker.js"
,"./assets/js/typeahead.js"
,"./assets/js/quantity-selector.js"
,"./assets/js/countdown.js"
,"./assets/js/window-scroll-action.js"
,"./assets/js/fitvid.js"
,"./assets/js/youtube-bg.js"
,"./assets/js/custom.js"];

        for (var i = 0; i < dynamicScripts.length; i++) {
            let node = document.createElement('script');
            node.src = dynamicScripts [i];
            node.type = 'text/javascript';
            node.async = false;
            node.charset = 'utf-8';
            document.getElementsByTagName('body')[0].appendChild(node);
        }

    }
}

}

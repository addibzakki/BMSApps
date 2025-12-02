package com.bmsappdev;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.pilloxa.backgroundjob.BackgroundJobPackage;
import com.pilloxa.backgroundjob.BackgroundJobPackage;
import br.com.dopaminamob.gpsstate.GPSStatePackage;
import com.brentvatne.react.ReactVideoPackage;
import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage;
import org.reactnative.camera.RNCameraPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.List;
import com.oblador.vectoricons.VectorIconsPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Tambahkan package manual jika belum autolinked
          // packages.add(new LocationServicesDialogBoxPackage());
          // packages.add(new RNCameraPackage());
          // packages.add(new ReactVideoPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    // Flipper sudah dinonaktifkan
  }
}

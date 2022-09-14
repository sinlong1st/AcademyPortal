import Main from "./Main";
import {KeepAwake,registerRootComponent} from "expo";

if(__DEV__) {
  KeepAwake.activate();
}

registerRootComponent(Main);
import { defineNuxtPlugin } from "#app";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Card from "primevue/card";
import Divider from "primevue/divider";
import Password from "primevue/password";
import InlineMessage from "primevue/inlinemessage";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true });
  nuxtApp.vueApp.component("Button", Button);
  nuxtApp.vueApp.component("InputText", InputText);
  nuxtApp.vueApp.component("Password", Password);
  nuxtApp.vueApp.component("InlineMessage", InlineMessage);
  nuxtApp.vueApp.component("Card", Card);
  nuxtApp.vueApp.component("Divider", Divider);
  nuxtApp.vueApp.component("Splitter", Splitter);
  nuxtApp.vueApp.component("SplitterPanel", SplitterPanel);
  nuxtApp.vueApp.component("Menu", Menu);
  nuxtApp.vueApp.component("Avatar", Avatar);
});

import { site } from "@/config/site";

export const themeBootScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(site.themeStorageKey)});var r=t==="light"?"light":"dark";var el=document.documentElement;el.setAttribute("data-theme",r);el.style.colorScheme=r;}catch(e){}})();`;

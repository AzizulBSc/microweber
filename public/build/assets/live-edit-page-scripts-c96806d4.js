window.self!==window.top&&(mw.require("liveedit.css"),mw.liveEditSaveService={grammarlyFix:function(e){return mw.$("grammarly-btn",e).remove(),mw.$("grammarly-card",e).remove(),mw.$("g.gr_",e).each(function(){mw.$(this).replaceWith(this.innerHTML)}),mw.$("[data-gramm_id]",e).removeAttr("data-gramm_id"),mw.$("[data-gramm]",e).removeAttr("data-gramm"),mw.$("[data-gramm_id]",e).removeAttr("data-gramm_id"),mw.$("grammarly-card",e).remove(),mw.$("grammarly-inline-cards",e).remove(),mw.$("grammarly-popups",e).remove(),mw.$("grammarly-extension",e).remove(),e},saving:!1,coreSave:function(e){if(!e)return!1;$.each(e,function(){var r=mw.tools.parseHtml(this.html).body;mw.liveEditSaveService.grammarlyFix(r),mw.liveEditSaveService.animationsClearFix(r),this.html=r.innerHTML}),mw.liveEditSaveService.saving=!0,e=JSON.stringify(e),e=btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g,function(a,i){return String.fromCharCode("0x"+i)})),e={data_base64:e};var t=mw.ajax({type:"POST",url:mw.settings.api_url+"save_edit",data:e,dataType:"json",success:function(r){r&&r.new_page_url&&!mw.liveEditSaveService.DraftSaving&&(window.mw.parent().askusertostay=!1,window.mw.askusertostay=!1,window.location.href=r.new_page_url)}});return t.always(function(){mw.liveEditSaveService.saving=!1}),t},parseContent:function(e){e=e||document.body;var t=mw.tools.parseHtml(e.innerHTML);mw.$(".element-current",t).removeClass("element-current"),mw.$(".element-active",t).removeClass("element-active"),mw.$(".disable-resize",t).removeClass("disable-resize"),mw.$(".mw-module-drag-clone",t).removeClass("mw-module-drag-clone"),mw.$(".ui-draggable",t).removeClass("ui-draggable"),mw.$(".ui-draggable-handle",t).removeClass("ui-draggable-handle"),mw.$(".mt-ready",t).removeClass("mt-ready"),mw.$(".mw-webkit-drag-hover-binded",t).removeClass("mw-webkit-drag-hover-binded"),mw.$(".module-cat-toggle-Modules",t).removeClass("module-cat-toggle-Modules"),mw.$(".mw-module-drag-clone",t).removeClass("mw-module-drag-clone"),mw.$("-module",t).removeClass("-module"),mw.$(".empty-element",t).remove(),mw.$(".empty-element",t).remove(),mw.$(".edit .ui-resizable-handle",t).remove(),mw.$("script",t).remove(),mw.tools.classNamespaceDelete("all","ui-",t,"starts"),mw.$("[contenteditable]",t).removeAttr("contenteditable");for(var r=t.querySelectorAll("[contenteditable]"),a=r.length,i=0;i<a;i++)r[i].removeAttribute("contenteditable");for(var r=t.querySelectorAll(".module"),a=r.length,i=0;i<a;i++)r[i].querySelector(".edit")===null&&(r[i].innerHTML="");return t},htmlAttrValidate:function(e){var t=[];return $.each(e,function(){var r=this.outerHTML;r=r.replace(/url\(&quot;/g,"url('"),r=r.replace(/jpg&quot;/g,"jpg'"),r=r.replace(/jpeg&quot;/g,"jpeg'"),r=r.replace(/png&quot;/g,"png'"),r=r.replace(/gif&quot;/g,"gif'"),t.push($(r)[0])}),t},cleanUnwantedTags:function(e){return mw.$(".mw-skip-and-remove,script",e).remove(),e},animationsClearFix:function(e){return mw.$('[class*="animate__"]').each(function(){mw.tools.classNamespaceDelete(this,"animate__")}),e},collectData:function(e){mw.$(e).each(function(){mw.$("meta",this).remove(),$(".mw-le-spacer",this).empty().removeAttr("data-resizable").removeAttr("style")}),e=this.htmlAttrValidate(e);var t=e.length,r=0,a={},i={};if(t>0)for(;r<t;r++){a.item=e[r];var o=mw.tools.mwattr(a.item,"rel");o||(mw.$(a.item).removeClass("changed"),mw.tools.foreachParents(a.item,function(c){var w=this.className,f=mw.tools.mwattr(this,"rel");mw.tools.hasClass(w,"edit")&&mw.tools.hasClass(w,"changed")&&f&&(a.item=this,mw.tools.stopLoop(c))}));var o=mw.tools.mwattr(a.item,"rel");if(!o){var d=a.item.id?"#"+a.item.id:"";console.warn("Skipped save: .edit"+d+" element does not have rel attribute.");continue}mw.$(a.item).removeClass("changed orig_changed"),mw.$(a.item).removeClass("module-over"),mw.$(".module-over",a.item).each(function(){mw.$(this).removeClass("module-over")}),mw.$("[class]",a.item).each(function(){var c=this.getAttribute("class");typeof c=="string"&&(c=c.trim()),c||this.removeAttribute("class")});var s=mw.liveEditSaveService.cleanUnwantedTags(a.item).innerHTML,n={},m=a.item.attributes;if(m.length>0)for(var l=0,v=m.length;l<v;l++)n[m[l].nodeName]=m[l].nodeValue;var u={attributes:n,html:s},g="field_data_"+r;i[g]=u}return i},getData:function(e){var t=mw.liveEditSaveService.parseContent(e).body,r=t.querySelectorAll(".edit.changed");return mw.liveEditSaveService.collectData(r)},saveDisabled:!1,draftDisabled:!1,save:function(e,t,r){if(mw.trigger("beforeSaveStart",e),mw.top().app&&mw.top().app&&mw.top().app.cssEditor&&mw.top().app.cssEditor.publishIfChanged(),mw.liveEditSaveService.saveDisabled)return!1;if(!e){var a=mw.liveEditSaveService.parseContent().body,i=a.querySelectorAll(".edit.changed");e=mw.liveEditSaveService.collectData(i)}var o=(mw.__pageAnimations||[]).filter(function(n){return n.animation!=="none"});if(o&&o.length>0){var d={group:"template",key:"animations-global",value:JSON.stringify(o)};mw.options.saveOption(d)}if(mw.tools.isEmptyObject(e))return t&&t.call({}),!1;mw._liveeditData=e,mw.trigger("saveStart",mw._liveeditData);var s=mw.liveEditSaveService.coreSave(mw._liveeditData);return s.error(function(n){s.status==403&&(mw.dialog({id:"save_content_error_iframe_modal",html:"<iframe id='save_content_error_iframe' style='overflow-x:hidden;overflow-y:auto;' class='mw-modal-frame' ></iframe>",width:$(window).width()-90,height:$(window).height()-90}),mw.askusertostay=!1,mw.$("#save_content_error_iframe").ready(function(){var m=document.getElementById("save_content_error_iframe").contentWindow.document;m.open(),m.write(s.responseText),m.close();var l=0;m=document.getElementById("save_content_error_iframe").contentWindow.document,mw.$("#save_content_error_iframe").load(function(){var v=mw.$(".challenge-form",m).length;l++,v&&l==2&&setTimeout(function(){mw.askusertostay=!1,mw.$("#save_content_error_iframe_modal").remove()},150)})})),r&&r.call(n)}),s.success(function(n){mw.$(".edit.changed").removeClass("changed"),mw.$(".orig_changed").removeClass("orig_changed"),document.querySelector(".edit.changed")!==null?mw.liveEditSaveService.save():(mw.askusertostay=!1,mw.trigger("saveEnd",n)),t&&t.call(n)}),s.fail(function(n,m,l){mw.trigger("saveFailed",m,l),r&&r.call(sdata)}),s}},addEventListener("load",()=>{const e=async()=>new Promise(t=>{mw.liveEditSaveService.save(void 0,()=>t(!0),()=>t(!1))});mw.top().app.save=async()=>await e(),window.addEventListener("keydown",function(t){mw.top().app.canvas.dispatch("iframeKeyDown",{event:t})})}),self.onbeforeunload=function(e){mw.top().app.canvas.dispatch("liveEditCanvasBeforeUnload");var t=mw.top().app.canvas.getWindow();if(t&&t.mw&&t.mw.askusertostay)return!0;mw.top().spinner({element:mw.top().app.canvas.getFrame().parentElement,decorate:!0,size:52}).show()},mw.drag=mw.drag||{},mw.drag.save=function(){return mw.liveEditSaveService.save()},mw.drag.fix_placeholders=function(e,t){t=t||".edit .row";var r="div.col-md",a=mw.top().app.templateSettings.helperClasses.external_grids_col_classes,i;for(i=a.length-1;i>=0;--i)r+=",div."+a[i];mw.$(t).each(function(){var o=mw.$(this);o.children(r).each(function(){var d=mw.$(this).children("*");if(d.size()==0){mw.$(this).append('<div class="element" id="mw-element-'+mw.random()+'"></div>');var d=mw.$(this).children("div.element")}})})},mw.drag.module_settings=function(){var e=mw.top().app.liveEdit.moduleHandle.getTarget();return mw.top().app.editor.dispatch("onModuleSettingsRequest",e)},document.addEventListener("keydown",function(e){if(e.ctrlKey&&e.key==="s")return mw.top().app.editor.dispatch("Ctrl+S",e)}));

mw.require("options.js");mw.liveEditSaveService={grammarlyFix:function(e){return mw.$("grammarly-btn",e).remove(),mw.$("grammarly-card",e).remove(),mw.$("g.gr_",e).each(function(){mw.$(this).replaceWith(this.innerHTML)}),mw.$("[data-gramm_id]",e).removeAttr("data-gramm_id"),mw.$("[data-gramm]",e).removeAttr("data-gramm"),mw.$("[data-gramm_id]",e).removeAttr("data-gramm_id"),mw.$("grammarly-card",e).remove(),mw.$("grammarly-inline-cards",e).remove(),mw.$("grammarly-popups",e).remove(),mw.$("grammarly-extension",e).remove(),e},saving:!1,coreSave:function(e){if(!e)return!1;$.each(e,function(){var r=mw.tools.parseHtml(this.html).body;mw.liveEditSaveService.grammarlyFix(r),mw.liveEditSaveService.animationsClearFix(r),this.html=r.innerHTML}),mw.liveEditSaveService.saving=!0,e=JSON.stringify(e),e=btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g,function(a,i){return String.fromCharCode("0x"+i)})),e={data_base64:e};var t=mw.ajax({type:"POST",url:mw.settings.api_url+"save_edit",data:e,dataType:"json",success:function(r){r&&r.new_page_url&&!mw.liveEditSaveService.DraftSaving&&(window.mw.parent().askusertostay=!1,window.mw.askusertostay=!1,window.location.href=r.new_page_url)}});return t.always(function(){mw.liveEditSaveService.saving=!1}),t},parseContent:function(e){e=e||document.body;var t=mw.tools.parseHtml(e.innerHTML);mw.$(".element-current",t).removeClass("element-current"),mw.$(".element-active",t).removeClass("element-active"),mw.$(".disable-resize",t).removeClass("disable-resize"),mw.$(".mw-module-drag-clone",t).removeClass("mw-module-drag-clone"),mw.$(".ui-draggable",t).removeClass("ui-draggable"),mw.$(".ui-draggable-handle",t).removeClass("ui-draggable-handle"),mw.$(".mt-ready",t).removeClass("mt-ready"),mw.$(".mw-webkit-drag-hover-binded",t).removeClass("mw-webkit-drag-hover-binded"),mw.$(".module-cat-toggle-Modules",t).removeClass("module-cat-toggle-Modules"),mw.$(".mw-module-drag-clone",t).removeClass("mw-module-drag-clone"),mw.$("-module",t).removeClass("-module"),mw.$(".empty-element",t).remove(),mw.$(".empty-element",t).remove(),mw.$(".edit .ui-resizable-handle",t).remove(),mw.$("script",t).remove(),mw.tools.classNamespaceDelete("all","ui-",t,"starts"),mw.$("[contenteditable]",t).removeAttr("contenteditable");for(var r=t.querySelectorAll("[contenteditable]"),a=r.length,i=0;i<a;i++)r[i].removeAttribute("contenteditable");for(var r=t.querySelectorAll(".module"),a=r.length,i=0;i<a;i++)r[i].querySelector(".edit")===null&&(r[i].innerHTML="");return t},htmlAttrValidate:function(e){var t=[];return $.each(e,function(){var r=this.outerHTML;r=r.replace(/url\(&quot;/g,"url('"),r=r.replace(/jpg&quot;/g,"jpg'"),r=r.replace(/jpeg&quot;/g,"jpeg'"),r=r.replace(/png&quot;/g,"png'"),r=r.replace(/gif&quot;/g,"gif'"),t.push($(r)[0])}),t},cleanUnwantedTags:function(e){return mw.$(".mw-skip-and-remove,script",e).remove(),e},animationsClearFix:function(e){return mw.$('[class*="animate__"]').each(function(){mw.tools.classNamespaceDelete(this,"animate__")}),e},collectData:function(e){mw.$(e).each(function(){mw.$("meta",this).remove(),$(".mw-le-spacer",this).empty().removeAttr("data-resizable").removeAttr("style")}),e=this.htmlAttrValidate(e);var t=e.length,r=0,a={},i={};if(t>0)for(;r<t;r++){a.item=e[r];var v=mw.tools.mwattr(a.item,"rel");v||(mw.$(a.item).removeClass("changed"),mw.tools.foreachParents(a.item,function(s){var d=this.className,f=mw.tools.mwattr(this,"rel");mw.tools.hasClass(d,"edit")&&mw.tools.hasClass(d,"changed")&&f&&(a.item=this,mw.tools.stopLoop(s))}));var v=mw.tools.mwattr(a.item,"rel");if(!v){var c=a.item.id?"#"+a.item.id:"";console.warn("Skipped save: .edit"+c+" element does not have rel attribute.");continue}mw.$(a.item).removeClass("changed orig_changed"),mw.$(a.item).removeClass("module-over"),mw.$(".module-over",a.item).each(function(){mw.$(this).removeClass("module-over")}),mw.$("[class]",a.item).each(function(){var s=this.getAttribute("class");typeof s=="string"&&(s=s.trim()),s||this.removeAttribute("class")});var l=mw.liveEditSaveService.cleanUnwantedTags(a.item).innerHTML,m={},n=a.item.attributes;if(n.length>0)for(var o=0,w=n.length;o<w;o++)m[n[o].nodeName]=n[o].nodeValue;var u={attributes:m,html:l},g="field_data_"+r;i[g]=u}return i},getData:function(e){var t=mw.liveEditSaveService.parseContent(e).body,r=t.querySelectorAll(".edit.changed");return mw.liveEditSaveService.collectData(r)},saveDisabled:!1,draftDisabled:!1,save:async function(e,t,r){if(mw.trigger("beforeSaveStart",e),mw.liveedit&&mw.liveedit.cssEditor&&mw.liveedit.cssEditor.publishIfChanged(),mw.liveEditSaveService.saveDisabled)return!1;if(!e){var a=mw.liveEditSaveService.parseContent().body,i=a.querySelectorAll(".edit.changed");e=mw.liveEditSaveService.collectData(i)}var v=(mw.__pageAnimations||[]).filter(function(m){return m.animation!=="none"}),c={group:"template",key:"animations-global",value:JSON.stringify(v)};if(await new Promise(m=>{mw.options.saveOption(c,function(){m()})}),mw.tools.isEmptyObject(e))return t&&t.call({}),!1;mw._liveeditData=e,mw.trigger("saveStart",mw._liveeditData);var l=mw.liveEditSaveService.coreSave(mw._liveeditData);return l.error(function(m){l.status==403&&(mw.dialog({id:"save_content_error_iframe_modal",html:"<iframe id='save_content_error_iframe' style='overflow-x:hidden;overflow-y:auto;' class='mw-modal-frame' ></iframe>",width:$(window).width()-90,height:$(window).height()-90}),mw.askusertostay=!1,mw.$("#save_content_error_iframe").ready(function(){var n=document.getElementById("save_content_error_iframe").contentWindow.document;n.open(),n.write(l.responseText),n.close();var o=0;n=document.getElementById("save_content_error_iframe").contentWindow.document,mw.$("#save_content_error_iframe").load(function(){var w=mw.$(".challenge-form",n).length;o++,w&&o==2&&setTimeout(function(){mw.askusertostay=!1,mw.$("#save_content_error_iframe_modal").remove()},150)})})),r&&r.call(m)}),l.success(function(m){mw.$(".edit.changed").removeClass("changed"),mw.$(".orig_changed").removeClass("orig_changed"),document.querySelector(".edit.changed")!==null?mw.liveEditSaveService.save():(mw.askusertostay=!1,mw.trigger("saveEnd",m)),t&&t.call(m)}),l.fail(function(m,n,o){mw.trigger("saveFailed",n,o),r&&r.call(sdata)}),l}};addEventListener("load",()=>{const e=async()=>new Promise(t=>{mw.liveEditSaveService.save(void 0,()=>t(!0),()=>t(!1))});mw.top().app.save=async()=>await e(),window.addEventListener("keydown",function(t){mw.top().app.canvas.dispatch("iframeKeyDown",{event:t})})});self.onbeforeunload=function(e){var t=mw.top().app.canvas.getWindow();if(t&&t.mw&&t.mw.askusertostay)return!0;mw.top().spinner({element:mw.top().app.canvas.getFrame().parentElement,decorate:!0,size:52}).show()};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGl2ZS1lZGl0LXBhZ2Utc2NyaXB0cy0xYzhjMDQ0YS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL01pY3Jvd2ViZXJQYWNrYWdlcy9MaXZlRWRpdC9yZXNvdXJjZXMvanMvdWkvbGl2ZS1lZGl0LXBhZ2Utc2NyaXB0cy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxubXcucmVxdWlyZSgnb3B0aW9ucy5qcycpXHJcblxyXG5tdy5saXZlRWRpdFNhdmVTZXJ2aWNlID0ge1xyXG4gICAgIGdyYW1tYXJseUZpeDpmdW5jdGlvbihkYXRhKXtcclxuXHJcbiAgICAgICAgbXcuJChcImdyYW1tYXJseS1idG5cIiwgZGF0YSkucmVtb3ZlKCk7XHJcbiAgICAgICAgbXcuJChcImdyYW1tYXJseS1jYXJkXCIsIGRhdGEpLnJlbW92ZSgpO1xyXG4gICAgICAgIG13LiQoXCJnLmdyX1wiLCBkYXRhKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIG13LiQodGhpcykucmVwbGFjZVdpdGgodGhpcy5pbm5lckhUTUwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG13LiQoXCJbZGF0YS1ncmFtbV9pZF1cIiwgZGF0YSkucmVtb3ZlQXR0cignZGF0YS1ncmFtbV9pZCcpO1xyXG4gICAgICAgIG13LiQoXCJbZGF0YS1ncmFtbV1cIiwgZGF0YSkucmVtb3ZlQXR0cignZGF0YS1ncmFtbScpO1xyXG4gICAgICAgIG13LiQoXCJbZGF0YS1ncmFtbV9pZF1cIiwgZGF0YSkucmVtb3ZlQXR0cignZGF0YS1ncmFtbV9pZCcpO1xyXG4gICAgICAgIG13LiQoXCJncmFtbWFybHktY2FyZFwiLCBkYXRhKS5yZW1vdmUoKTtcclxuICAgICAgICBtdy4kKFwiZ3JhbW1hcmx5LWlubGluZS1jYXJkc1wiLCBkYXRhKS5yZW1vdmUoKTtcclxuICAgICAgICBtdy4kKFwiZ3JhbW1hcmx5LXBvcHVwc1wiLCBkYXRhKS5yZW1vdmUoKTtcclxuICAgICAgICBtdy4kKFwiZ3JhbW1hcmx5LWV4dGVuc2lvblwiLCBkYXRhKS5yZW1vdmUoKTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH0sXHJcbiAgICBzYXZpbmc6IGZhbHNlLFxyXG4gICAgY29yZVNhdmU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICBpZiAoIWRhdGEpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAkLmVhY2goZGF0YSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdmFyIGJvZHkgPSBtdy50b29scy5wYXJzZUh0bWwodGhpcy5odG1sKS5ib2R5O1xyXG4gICAgICAgICAgICBtdy5saXZlRWRpdFNhdmVTZXJ2aWNlLmdyYW1tYXJseUZpeChib2R5KTtcclxuICAgICAgICAgICAgbXcubGl2ZUVkaXRTYXZlU2VydmljZS5hbmltYXRpb25zQ2xlYXJGaXgoYm9keSk7XHJcbiAgICAgICAgICAgIHRoaXMuaHRtbCA9IGJvZHkuaW5uZXJIVE1MO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG13LmxpdmVFZGl0U2F2ZVNlcnZpY2Uuc2F2aW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLyoqKioqKioqKioqKiAgU1RBUlQgYmFzZTY0ICAqKioqKioqKioqKiovXHJcbiAgICAgICAgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG4gICAgICAgIGRhdGEgPSBidG9hKGVuY29kZVVSSUNvbXBvbmVudChkYXRhKS5yZXBsYWNlKC8lKFswLTlBLUZdezJ9KS9nLFxyXG4gICAgICAgICAgICBmdW5jdGlvbiB0b1NvbGlkQnl0ZXMobWF0Y2gsIHAxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgnMHgnICsgcDEpO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgZGF0YSA9IHtkYXRhX2Jhc2U2NDpkYXRhfTtcclxuICAgICAgICAvKioqKioqKioqKioqICBFTkQgYmFzZTY0ICAqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgIHZhciB4aHIgPSBtdy5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6IG13LnNldHRpbmdzLmFwaV91cmwgKyAnc2F2ZV9lZGl0JyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoc2F2ZWRfZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYoc2F2ZWRfZGF0YSAmJiBzYXZlZF9kYXRhLm5ld19wYWdlX3VybCAmJiAhbXcubGl2ZUVkaXRTYXZlU2VydmljZS5EcmFmdFNhdmluZyl7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm13LnBhcmVudCgpLmFza3VzZXJ0b3N0YXkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubXcuYXNrdXNlcnRvc3RheSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmICA9IHNhdmVkX2RhdGEubmV3X3BhZ2VfdXJsO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB4aHIuYWx3YXlzKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBtdy5saXZlRWRpdFNhdmVTZXJ2aWNlLnNhdmluZyA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB4aHI7XHJcbiAgICB9LFxyXG4gICAgcGFyc2VDb250ZW50OiBmdW5jdGlvbihyb290KSB7XHJcbiAgICAgICAgcm9vdCA9IHJvb3QgfHwgZG9jdW1lbnQuYm9keTtcclxuICAgICAgICB2YXIgZG9jID0gbXcudG9vbHMucGFyc2VIdG1sKHJvb3QuaW5uZXJIVE1MKTtcclxuICAgICAgICBtdy4kKCcuZWxlbWVudC1jdXJyZW50JywgZG9jKS5yZW1vdmVDbGFzcygnZWxlbWVudC1jdXJyZW50Jyk7XHJcbiAgICAgICAgbXcuJCgnLmVsZW1lbnQtYWN0aXZlJywgZG9jKS5yZW1vdmVDbGFzcygnZWxlbWVudC1hY3RpdmUnKTtcclxuICAgICAgICBtdy4kKCcuZGlzYWJsZS1yZXNpemUnLCBkb2MpLnJlbW92ZUNsYXNzKCdkaXNhYmxlLXJlc2l6ZScpO1xyXG4gICAgICAgIG13LiQoJy5tdy1tb2R1bGUtZHJhZy1jbG9uZScsIGRvYykucmVtb3ZlQ2xhc3MoJ213LW1vZHVsZS1kcmFnLWNsb25lJyk7XHJcbiAgICAgICAgbXcuJCgnLnVpLWRyYWdnYWJsZScsIGRvYykucmVtb3ZlQ2xhc3MoJ3VpLWRyYWdnYWJsZScpO1xyXG4gICAgICAgIG13LiQoJy51aS1kcmFnZ2FibGUtaGFuZGxlJywgZG9jKS5yZW1vdmVDbGFzcygndWktZHJhZ2dhYmxlLWhhbmRsZScpO1xyXG4gICAgICAgIG13LiQoJy5tdC1yZWFkeScsIGRvYykucmVtb3ZlQ2xhc3MoJ210LXJlYWR5Jyk7XHJcbiAgICAgICAgbXcuJCgnLm13LXdlYmtpdC1kcmFnLWhvdmVyLWJpbmRlZCcsIGRvYykucmVtb3ZlQ2xhc3MoJ213LXdlYmtpdC1kcmFnLWhvdmVyLWJpbmRlZCcpO1xyXG4gICAgICAgIG13LiQoJy5tb2R1bGUtY2F0LXRvZ2dsZS1Nb2R1bGVzJywgZG9jKS5yZW1vdmVDbGFzcygnbW9kdWxlLWNhdC10b2dnbGUtTW9kdWxlcycpO1xyXG4gICAgICAgIG13LiQoJy5tdy1tb2R1bGUtZHJhZy1jbG9uZScsIGRvYykucmVtb3ZlQ2xhc3MoJ213LW1vZHVsZS1kcmFnLWNsb25lJyk7XHJcbiAgICAgICAgbXcuJCgnLW1vZHVsZScsIGRvYykucmVtb3ZlQ2xhc3MoJy1tb2R1bGUnKTtcclxuICAgICAgICBtdy4kKCcuZW1wdHktZWxlbWVudCcsIGRvYykucmVtb3ZlKCk7XHJcbiAgICAgICAgbXcuJCgnLmVtcHR5LWVsZW1lbnQnLCBkb2MpLnJlbW92ZSgpO1xyXG4gICAgICAgIG13LiQoJy5lZGl0IC51aS1yZXNpemFibGUtaGFuZGxlJywgZG9jKS5yZW1vdmUoKTtcclxuICAgICAgICBtdy4kKCdzY3JpcHQnLCBkb2MpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAvL3ZhciBkb2MgPSBtdy4kKGRvYykuZmluZCgnc2NyaXB0JykucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIG13LnRvb2xzLmNsYXNzTmFtZXNwYWNlRGVsZXRlKCdhbGwnLCAndWktJywgZG9jLCAnc3RhcnRzJyk7XHJcbiAgICAgICAgbXcuJChcIltjb250ZW50ZWRpdGFibGVdXCIsIGRvYykucmVtb3ZlQXR0cihcImNvbnRlbnRlZGl0YWJsZVwiKTtcclxuICAgICAgICB2YXIgYWxsID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tjb250ZW50ZWRpdGFibGVdJyksXHJcbiAgICAgICAgICAgIGwgPSBhbGwubGVuZ3RoLFxyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBhbGxbaV0ucmVtb3ZlQXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGFsbCA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKCcubW9kdWxlJyksXHJcbiAgICAgICAgICAgIGwgPSBhbGwubGVuZ3RoLFxyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoYWxsW2ldLnF1ZXJ5U2VsZWN0b3IoJy5lZGl0JykgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGFsbFtpXS5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZG9jO1xyXG4gICAgfSxcclxuICAgIGh0bWxBdHRyVmFsaWRhdGU6ZnVuY3Rpb24oZWRpdHMpe1xyXG4gICAgICAgIHZhciBmaW5hbCA9IFtdO1xyXG4gICAgICAgICQuZWFjaChlZGl0cywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdmFyIGh0bWwgPSB0aGlzLm91dGVySFRNTDtcclxuICAgICAgICAgICAgaHRtbCA9IGh0bWwucmVwbGFjZSgvdXJsXFwoJnF1b3Q7L2csIFwidXJsKCdcIik7XHJcbiAgICAgICAgICAgIGh0bWwgPSBodG1sLnJlcGxhY2UoL2pwZyZxdW90Oy9nLCBcImpwZydcIik7XHJcbiAgICAgICAgICAgIGh0bWwgPSBodG1sLnJlcGxhY2UoL2pwZWcmcXVvdDsvZywgXCJqcGVnJ1wiKTtcclxuICAgICAgICAgICAgaHRtbCA9IGh0bWwucmVwbGFjZSgvcG5nJnF1b3Q7L2csIFwicG5nJ1wiKTtcclxuICAgICAgICAgICAgaHRtbCA9IGh0bWwucmVwbGFjZSgvZ2lmJnF1b3Q7L2csIFwiZ2lmJ1wiKTtcclxuICAgICAgICAgICAgZmluYWwucHVzaCgkKGh0bWwpWzBdKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBmaW5hbDtcclxuICAgIH0sXHJcbiAgICBjbGVhblVud2FudGVkVGFnczogZnVuY3Rpb24gKGJvZHkpIHtcclxuXHJcblxyXG4gICAgICAgIG13LiQoJy5tdy1za2lwLWFuZC1yZW1vdmUsc2NyaXB0JywgYm9keSkucmVtb3ZlKCk7XHJcbiAgICAgICAgcmV0dXJuIGJvZHk7XHJcbiAgICB9LFxyXG4gICAgYW5pbWF0aW9uc0NsZWFyRml4OmZ1bmN0aW9uKGJvZHkpe1xyXG4gICAgICAgIG13LiQoJ1tjbGFzcyo9XCJhbmltYXRlX19cIl0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbXcudG9vbHMuY2xhc3NOYW1lc3BhY2VEZWxldGUodGhpcywgJ2FuaW1hdGVfXycpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBib2R5O1xyXG4gICAgfSxcclxuICAgIGNvbGxlY3REYXRhOiBmdW5jdGlvbihlZGl0cykge1xyXG4gICAgICAgIG13LiQoZWRpdHMpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgbXcuJCgnbWV0YScsIHRoaXMpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAkKCcubXctbGUtc3BhY2VyJywgdGhpcykuZW1wdHkoKS5yZW1vdmVBdHRyKCdkYXRhLXJlc2l6YWJsZScpLnJlbW92ZUF0dHIoJ3N0eWxlJylcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZWRpdHMgPSB0aGlzLmh0bWxBdHRyVmFsaWRhdGUoZWRpdHMpO1xyXG4gICAgICAgIHZhciBsID0gZWRpdHMubGVuZ3RoLFxyXG4gICAgICAgICAgICBpID0gMCxcclxuICAgICAgICAgICAgaGVscGVyID0ge30sXHJcbiAgICAgICAgICAgIG1hc3RlciA9IHt9O1xyXG4gICAgICAgIGlmIChsID4gMCkge1xyXG4gICAgICAgICAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaGVscGVyLml0ZW0gPSBlZGl0c1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciByZWwgPSBtdy50b29scy5td2F0dHIoaGVscGVyLml0ZW0sICdyZWwnKTtcclxuICAgICAgICAgICAgICAgIGlmICghcmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbXcuJChoZWxwZXIuaXRlbSkucmVtb3ZlQ2xhc3MoJ2NoYW5nZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICBtdy50b29scy5mb3JlYWNoUGFyZW50cyhoZWxwZXIuaXRlbSwgZnVuY3Rpb24obG9vcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xzID0gdGhpcy5jbGFzc05hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWwgPSBtdy50b29scy5td2F0dHIodGhpcywgJ3JlbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobXcudG9vbHMuaGFzQ2xhc3MoY2xzLCAnZWRpdCcpICYmIG13LnRvb2xzLmhhc0NsYXNzKGNscywgJ2NoYW5nZWQnKSAmJiAoISFyZWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWxwZXIuaXRlbSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdy50b29scy5zdG9wTG9vcChsb29wKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHJlbCA9IG13LnRvb2xzLm13YXR0cihoZWxwZXIuaXRlbSwgJ3JlbCcpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSAhIWhlbHBlci5pdGVtLmlkID8gJyMnK2hlbHBlci5pdGVtLmlkIDogJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdTa2lwcGVkIHNhdmU6IC5lZGl0JytmaWVsZCsnIGVsZW1lbnQgZG9lcyBub3QgaGF2ZSByZWwgYXR0cmlidXRlLicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbXcuJChoZWxwZXIuaXRlbSkucmVtb3ZlQ2xhc3MoJ2NoYW5nZWQgb3JpZ19jaGFuZ2VkJyk7XHJcbiAgICAgICAgICAgICAgICBtdy4kKGhlbHBlci5pdGVtKS5yZW1vdmVDbGFzcygnbW9kdWxlLW92ZXInKTtcclxuXHJcbiAgICAgICAgICAgICAgICBtdy4kKCcubW9kdWxlLW92ZXInLCBoZWxwZXIuaXRlbSkuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIG13LiQodGhpcykucmVtb3ZlQ2xhc3MoJ21vZHVsZS1vdmVyJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIG13LiQoJ1tjbGFzc10nLCBoZWxwZXIuaXRlbSkuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjbHMgPSB0aGlzLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBjbHMgPT09ICdzdHJpbmcnKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xzID0gY2xzLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIWNscyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9IG13LmxpdmVFZGl0U2F2ZVNlcnZpY2UuY2xlYW5VbndhbnRlZFRhZ3MoaGVscGVyLml0ZW0pLmlubmVySFRNTDtcclxuICAgICAgICAgICAgICAgIHZhciBhdHRyX29iaiA9IHt9O1xyXG4gICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gaGVscGVyLml0ZW0uYXR0cmlidXRlcztcclxuICAgICAgICAgICAgICAgIGlmIChhdHRycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWwgPSBhdHRycy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICg7IGFpIDwgYWw7IGFpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cl9vYmpbYXR0cnNbYWldLm5vZGVOYW1lXSA9IGF0dHJzW2FpXS5ub2RlVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IHtcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiBhdHRyX29iaixcclxuICAgICAgICAgICAgICAgICAgICBodG1sOiBjb250ZW50XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iamRhdGEgPSBcImZpZWxkX2RhdGFfXCIgKyBpO1xyXG4gICAgICAgICAgICAgICAgbWFzdGVyW29iamRhdGFdID0gb2JqO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtYXN0ZXI7XHJcbiAgICB9LFxyXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24ocm9vdCkge1xyXG4gICAgICAgIHZhciBib2R5ID0gbXcubGl2ZUVkaXRTYXZlU2VydmljZS5wYXJzZUNvbnRlbnQocm9vdCkuYm9keSxcclxuICAgICAgICAgICAgZWRpdHMgPSBib2R5LnF1ZXJ5U2VsZWN0b3JBbGwoJy5lZGl0LmNoYW5nZWQnKTtcclxuICAgICAgICByZXR1cm4gbXcubGl2ZUVkaXRTYXZlU2VydmljZS5jb2xsZWN0RGF0YShlZGl0cyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNhdmVEaXNhYmxlZDogZmFsc2UsXHJcbiAgICBkcmFmdERpc2FibGVkOiBmYWxzZSxcclxuICAgIHNhdmU6IGFzeW5jIGZ1bmN0aW9uKGRhdGEsIHN1Y2Nlc3MsIGZhaWwpIHtcclxuICAgICAgICBtdy50cmlnZ2VyKCdiZWZvcmVTYXZlU3RhcnQnLCBkYXRhKTtcclxuICAgICAgICAvLyB0b2RvOlxyXG4gICAgICAgIGlmIChtdy5saXZlZWRpdCAmJiBtdy5saXZlZWRpdC5jc3NFZGl0b3IpIHtcclxuICAgICAgICAgICAgbXcubGl2ZWVkaXQuY3NzRWRpdG9yLnB1Ymxpc2hJZkNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG13LmxpdmVFZGl0U2F2ZVNlcnZpY2Uuc2F2ZURpc2FibGVkKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYoIWRhdGEpe1xyXG4gICAgICAgICAgICB2YXIgYm9keSA9IG13LmxpdmVFZGl0U2F2ZVNlcnZpY2UucGFyc2VDb250ZW50KCkuYm9keSxcclxuICAgICAgICAgICAgICAgIGVkaXRzID0gYm9keS5xdWVyeVNlbGVjdG9yQWxsKCcuZWRpdC5jaGFuZ2VkJyk7XHJcbiAgICAgICAgICAgIGRhdGEgPSBtdy5saXZlRWRpdFNhdmVTZXJ2aWNlLmNvbGxlY3REYXRhKGVkaXRzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBhbmltYXRpb25zID0gKG13Ll9fcGFnZUFuaW1hdGlvbnMgfHwgW10pLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbS5hbmltYXRpb24gIT09ICdub25lJ1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICBncm91cDogJ3RlbXBsYXRlJyxcclxuICAgICAgICAgICAga2V5OiAnYW5pbWF0aW9ucy1nbG9iYWwnLFxyXG4gICAgICAgICAgICB2YWx1ZTogSlNPTi5zdHJpbmdpZnkoYW5pbWF0aW9ucylcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+ICB7XHJcbiAgICAgICAgICAgIG13Lm9wdGlvbnMuc2F2ZU9wdGlvbihvcHRpb25zLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcblxyXG5cclxuXHJcbiAgICAgICAgaWYgKG13LnRvb2xzLmlzRW1wdHlPYmplY3QoZGF0YSkpIHtcclxuICAgICAgICAgICAgaWYoc3VjY2Vzcyl7XHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzLmNhbGwoe30pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbXcuX2xpdmVlZGl0RGF0YSA9IGRhdGE7XHJcblxyXG4gICAgICAgIG13LnRyaWdnZXIoJ3NhdmVTdGFydCcsIG13Ll9saXZlZWRpdERhdGEpO1xyXG5cclxuICAgICAgICB2YXIgeGhyID0gbXcubGl2ZUVkaXRTYXZlU2VydmljZS5jb3JlU2F2ZShtdy5fbGl2ZWVkaXREYXRhKTtcclxuICAgICAgICB4aHIuZXJyb3IoZnVuY3Rpb24oc2RhdGEpe1xyXG5cclxuICAgICAgICAgICAgaWYoeGhyLnN0YXR1cyA9PSA0MDMpe1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vZGFsID0gbXcuZGlhbG9nKHtcclxuICAgICAgICAgICAgICAgICAgICBpZCA6ICdzYXZlX2NvbnRlbnRfZXJyb3JfaWZyYW1lX21vZGFsJyxcclxuICAgICAgICAgICAgICAgICAgICBodG1sOlwiPGlmcmFtZSBpZD0nc2F2ZV9jb250ZW50X2Vycm9yX2lmcmFtZScgc3R5bGU9J292ZXJmbG93LXg6aGlkZGVuO292ZXJmbG93LXk6YXV0bzsnIGNsYXNzPSdtdy1tb2RhbC1mcmFtZScgPjwvaWZyYW1lPlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiQod2luZG93KS53aWR0aCgpIC0gOTAsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiQod2luZG93KS5oZWlnaHQoKSAtIDkwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBtdy5hc2t1c2VydG9zdGF5ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgbXcuJChcIiNzYXZlX2NvbnRlbnRfZXJyb3JfaWZyYW1lXCIpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkb2MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2F2ZV9jb250ZW50X2Vycm9yX2lmcmFtZScpLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2Mud3JpdGUoeGhyLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNhdmVfY29udGVudF9lcnJvcl9pZnJhbWVfcmVsb2FkcyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhdmVfY29udGVudF9lcnJvcl9pZnJhbWUnKS5jb250ZW50V2luZG93LmRvY3VtZW50O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtdy4kKFwiI3NhdmVfY29udGVudF9lcnJvcl9pZnJhbWVcIikubG9hZChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjbG91ZGZsYXJlIGNhcHRjaGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzX2NmID0gIG13LiQoJy5jaGFsbGVuZ2UtZm9ybScsZG9jKS5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVfY29udGVudF9lcnJvcl9pZnJhbWVfcmVsb2FkcysrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoaXNfY2YgJiYgc2F2ZV9jb250ZW50X2Vycm9yX2lmcmFtZV9yZWxvYWRzID09IDIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG13LmFza3VzZXJ0b3N0YXkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdy4kKCcjc2F2ZV9jb250ZW50X2Vycm9yX2lmcmFtZV9tb2RhbCcpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTUwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihmYWlsKXtcclxuICAgICAgICAgICAgICAgIGZhaWwuY2FsbChzZGF0YSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHhoci5zdWNjZXNzKGZ1bmN0aW9uKHNkYXRhKSB7XHJcbiAgICAgICAgICAgIG13LiQoJy5lZGl0LmNoYW5nZWQnKS5yZW1vdmVDbGFzcygnY2hhbmdlZCcpO1xyXG4gICAgICAgICAgICBtdy4kKCcub3JpZ19jaGFuZ2VkJykucmVtb3ZlQ2xhc3MoJ29yaWdfY2hhbmdlZCcpO1xyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVkaXQuY2hhbmdlZCcpICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBtdy5saXZlRWRpdFNhdmVTZXJ2aWNlLnNhdmUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG13LmFza3VzZXJ0b3N0YXkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIG13LnRyaWdnZXIoJ3NhdmVFbmQnLCBzZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoc3VjY2Vzcyl7XHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzLmNhbGwoc2RhdGEpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgeGhyLmZhaWwoZnVuY3Rpb24oanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XHJcbiAgICAgICAgICAgIG13LnRyaWdnZXIoJ3NhdmVGYWlsZWQnLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bik7XHJcbiAgICAgICAgICAgIGlmKGZhaWwpe1xyXG4gICAgICAgICAgICAgICAgZmFpbC5jYWxsKHNkYXRhKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHhocjtcclxuICAgIH0sXHJcblxyXG59XHJcblxyXG5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgY29uc3Qgc2F2ZSA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgbXcubGl2ZUVkaXRTYXZlU2VydmljZS5zYXZlKHVuZGVmaW5lZCwgKCkgPT4gcmVzb2x2ZSh0cnVlKSwgKCkgPT4gcmVzb2x2ZShmYWxzZSkpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9O1xyXG5cclxuICAgIG13LnRvcCgpLmFwcC5zYXZlID0gYXN5bmMgKCkgPT4ge1xyXG5cclxuICAgICAgICByZXR1cm4gYXdhaXQgc2F2ZSgpXHJcbiAgICB9O1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgIG13LnRvcCgpLmFwcC5jYW52YXMuZGlzcGF0Y2goJ2lmcmFtZUtleURvd24nLCB7ZXZlbnR9KVxyXG4gICAgfSlcclxuXHJcbn0pXHJcblxyXG5zZWxmLm9uYmVmb3JldW5sb2FkID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIC8vIHByZXZlbnQgdXNlciBmcm9tIGxlYXZpbmcgaWYgdGhlcmUgYXJlIHVuc2F2ZWQgY2hhbmdlc1xyXG4gICAgdmFyIGxpdmVFZGl0SWZyYW1lID0gKG13LnRvcCgpLmFwcC5jYW52YXMuZ2V0V2luZG93KCkpO1xyXG4gICAgaWYgKGxpdmVFZGl0SWZyYW1lXHJcbiAgICAgICAgJiYgbGl2ZUVkaXRJZnJhbWUubXcgJiYgbGl2ZUVkaXRJZnJhbWUubXcuYXNrdXNlcnRvc3RheSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBtdy50b3AoKS5zcGlubmVyKHtlbGVtZW50OiBtdy50b3AoKS5hcHAuY2FudmFzLmdldEZyYW1lKCkucGFyZW50RWxlbWVudCwgZGVjb3JhdGU6IHRydWUsIHNpemU6IDUyfSkuc2hvdygpXHJcbiAgICB9XHJcbn07XHJcbiJdLCJuYW1lcyI6WyJkYXRhIiwiYm9keSIsIm1hdGNoIiwicDEiLCJ4aHIiLCJzYXZlZF9kYXRhIiwicm9vdCIsImRvYyIsImFsbCIsImwiLCJlZGl0cyIsImZpbmFsIiwiaHRtbCIsImkiLCJoZWxwZXIiLCJtYXN0ZXIiLCJyZWwiLCJsb29wIiwiY2xzIiwiZmllbGQiLCJjb250ZW50IiwiYXR0cl9vYmoiLCJhdHRycyIsImFpIiwiYWwiLCJvYmoiLCJvYmpkYXRhIiwic3VjY2VzcyIsImZhaWwiLCJhbmltYXRpb25zIiwiaXRlbSIsIm9wdGlvbnMiLCJyZXNvbHZlIiwic2RhdGEiLCJzYXZlX2NvbnRlbnRfZXJyb3JfaWZyYW1lX3JlbG9hZHMiLCJpc19jZiIsImpxWEhSIiwidGV4dFN0YXR1cyIsImVycm9yVGhyb3duIiwic2F2ZSIsImV2ZW50IiwibGl2ZUVkaXRJZnJhbWUiXSwibWFwcGluZ3MiOiJBQUNBLEdBQUcsUUFBUSxZQUFZLEVBRXZCLEdBQUcsb0JBQXNCLENBQ3BCLGFBQWEsU0FBU0EsRUFBSyxDQUV4QixVQUFHLEVBQUUsZ0JBQWlCQSxDQUFJLEVBQUUsT0FBTSxFQUNsQyxHQUFHLEVBQUUsaUJBQWtCQSxDQUFJLEVBQUUsT0FBTSxFQUNuQyxHQUFHLEVBQUUsUUFBU0EsQ0FBSSxFQUFFLEtBQUssVUFBVSxDQUMvQixHQUFHLEVBQUUsSUFBSSxFQUFFLFlBQVksS0FBSyxTQUFTLENBQ2pELENBQVMsRUFDRCxHQUFHLEVBQUUsa0JBQW1CQSxDQUFJLEVBQUUsV0FBVyxlQUFlLEVBQ3hELEdBQUcsRUFBRSxlQUFnQkEsQ0FBSSxFQUFFLFdBQVcsWUFBWSxFQUNsRCxHQUFHLEVBQUUsa0JBQW1CQSxDQUFJLEVBQUUsV0FBVyxlQUFlLEVBQ3hELEdBQUcsRUFBRSxpQkFBa0JBLENBQUksRUFBRSxPQUFNLEVBQ25DLEdBQUcsRUFBRSx5QkFBMEJBLENBQUksRUFBRSxPQUFNLEVBQzNDLEdBQUcsRUFBRSxtQkFBb0JBLENBQUksRUFBRSxPQUFNLEVBQ3JDLEdBQUcsRUFBRSxzQkFBdUJBLENBQUksRUFBRSxPQUFNLEVBQ2pDQSxDQUNWLEVB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

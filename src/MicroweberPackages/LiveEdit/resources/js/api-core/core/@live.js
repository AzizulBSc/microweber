import {Handle} from "./handle.js";
import {GetPointerTargets} from "./pointer.js";
import {ModeAuto} from "./mode-auto.js";
import {Handles} from "./handles.js";
import {ObjectService} from "./classes/object.service.js";
import {DroppableElementAnalyzerService} from "./analizer.js";
import {DropIndicator} from "./interact.js";
import {ElementHandleContent} from "./handles-content/element.js";
import {ModuleHandleContent} from "./handles-content/module.js";
import {LayoutHandleContent} from "./handles-content/layout.js";
import {ElementManager} from "./classes/element.js";
import {lang} from "./i18n.js";
import {Dialog} from "./classes/dialog.js";
import {Resizable} from "./classes/resizable.js";
import {HandleMenu} from "./handle-menu.js";

import {Tooltip} from "./tooltip.js";


export class LiveEdit {


    constructor(options) {

        const scope = this;

        const _e = {};
        this.on = (e, f) => { _e[e] ? _e[e].push(f) : (_e[e] = [f]) };
        this.dispatch = (e, f) => { _e[e] ? _e[e].forEach( (c) => { c.call(this, f); }) : ''; };

        this.paused = false;

        var defaults = {
            elementClass: 'element',
            backgroundImageHolder: 'background-image-holder',
            cloneableClass: 'cloneable',
            editClass: 'edit',
            stateManager: null,
            moduleClass: 'module',
/*            rowClass: 'mw-row',
            colClass: 'mw-col',
            safeElementClass: 'safe-element',
            plainElementClass: 'plain-text',
            emptyElementClass: 'empty-element',*/
            nodrop: 'nodrop',
            allowDrop: 'allow-drop',
            unEditableModules: [
                '[type="template_settings"]'
            ],
            frameworksClasses: {
                col: ['col', 'mw-col']
            },
            document: document,
            mode: 'manual', // 'auto' | 'manual'
            lang: 'en',
            strict: true, // element and modules should be dropped only in layouts
            strictLayouts: false, // layouts can only exist as edit-field children
            viewWindow: window,
  
        };

        this.settings = ObjectService.extend({}, defaults, options);
        this.document = this.settings.document;

        this.stateManager = this.settings.stateManager;

        this.lang = function (key) {
            return lang(key, this.settings.lang);
        }

        if(!this.settings.root) {
            this.settings.root = this.settings.document.body
        }

        this.root = this.settings.root;

        this.elementAnalyzer = new DroppableElementAnalyzerService(this.settings);

        this.dropIndicator = new DropIndicator(this.settings);

        const elementHandleContent = new ElementHandleContent(this);
        const moduleHandleContent = new ModuleHandleContent(this);
        const layoutHandleContent = new LayoutHandleContent(this);

        this.elementHandleContent = elementHandleContent;
        this.moduleHandleContent = moduleHandleContent;
        this.layoutHandleContent = layoutHandleContent;

        this.layoutHandleContent.on('insertLayoutRequest', () => {
            this.dispatch('insertLayoutRequest')
        })

        this.dialog = function (options) {
            if(!options){
                options = {};
            }

            var defaults = {
                // document: scope.document,
                document: window.top.document,
                position: moduleHandleContent.menu.getTarget(),
                mode: 'absolute'
            };

            scope.pause();
            const _dlg = new Dialog(ObjectService.extend({}, defaults, options));

            _dlg.on('close', function () {
                scope.play();
            });

            return _dlg;
        };



        var elementHandle = this.elementHandle = new Handle({
            ...this.settings,
            dropIndicator: this.dropIndicator,
            content: elementHandleContent.root,
            handle: elementHandleContent.menu.title,
            document: this.settings.document,
            stateManager: this.settings.stateManager,
            resizable: true
        });

        elementHandle.on('targetChange', function (target){
            elementHandleContent.menu.setTarget(target);
            var title = '';
            if(target.nodeName === 'P') {
                title = scope.lang('Paragraph');
            } else if(/(H[1-6])/.test(target.nodeName)) {
                title = scope.lang('Title') + ' ' + target.nodeName.replace( /^\D+/g, '');
            } else if(target.nodeName === 'IMG' || target.nodeName === 'IMAGE') {
                title = scope.lang('Image');
            }  else if(['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(target.nodeName)) {
                title = scope.lang('Title ' + target.nodeName.replace('H', ''));
            }  else {
                title = scope.lang('Text');
            }
             elementHandleContent.menu.setTitle(title);
        });

        this.moduleHandle = new Handle({
            ...this.settings,
            dropIndicator: this.dropIndicator,
            content: moduleHandleContent.root,
            handle: moduleHandleContent.menu.title,
            document: this.settings.document,
            stateManager: this.settings.stateManager
        });
        var moduleHandle = this.moduleHandle;

        this.getModuleQuickSettings = type => {
            return new Promise(resolve => {
                resolve(mw.quickSettings[type]);
               this.dispatch('moduleQuickSettings', {module: type});
            });
        };


        moduleHandle.on('targetChange', function (node){


            scope.getModuleQuickSettings(node.dataset.type).then(function (settings) {

                moduleHandleContent.menu.root.remove();
                

                

                moduleHandleContent.menu = new HandleMenu({
                    id: 'mw-handle-item-element-menu',
                    title: node.dataset.type,
                    rootScope: scope,
                    buttons: settings ? settings.mainMenu || [] : [],
                    data: {target: node}
                });
                moduleHandleContent.menu.setTarget(node);


                moduleHandleContent.menu.show();

                moduleHandleContent.root.append(moduleHandleContent.menu.root);


            });

        });

        this.layoutHandle = new Handle({
            ...this.settings,
            dropIndicator: this.dropIndicator,
            content: layoutHandleContent.root,
            handle: layoutHandleContent.menu.title,
            document: this.settings.document,
            stateManager: this.settings.stateManager,
            type: 'layout'
        });

        var layoutHandle = this.layoutHandle;

        var title = scope.lang('Layout');
        layoutHandleContent.menu.setTitle(title)
        layoutHandle.on('targetChange', function (target){
            layoutHandleContent.menu.setTarget(target);
            layoutHandleContent.menu.setTitle(title);
            if( scope.elementAnalyzer.isEditOrInEdit(target)) {
                layoutHandleContent.plusTop.show()
                layoutHandleContent.plusBottom.show()
            } else {
                layoutHandleContent.plusTop.hide()
                layoutHandleContent.plusBottom.hide()
            }
        });

        layoutHandleContent.handle = layoutHandle;
        moduleHandleContent.handle = moduleHandle;
        elementHandleContent.handle = elementHandle;

        this.hoverHandle = 

        this.handles = new Handles({
            element: elementHandle,
            module: moduleHandle,
            layout: layoutHandle
        });
        this.observe = new GetPointerTargets(this.settings);
        this.init();
    }

    play() {
        this.paused = false;
    }

    pause() {
        this.handles.hide();
        this.paused = true;
    }

    init() {
        if(this.settings.mode === 'auto') {
            ModeAuto(this);
        }


        const _eventsHandle = (e) => {
            if(this.handles.targetIsOrInsideHandle(e)) {
                return
            }
            const elements = this.observe.fromEvent(e);
            
            const first = elements[0];
            this.handles.hide()
            if(first) {
               const type = this.elementAnalyzer.getType(first);
               if(type && type !== 'edit') {
                    this.handles.set(type, elements[0])
                   if(type === 'element') {
                       this.handles.hide('module')
                   } else if(type === 'module') {
                       this.handles.hide('element')
                   } else {
                        this.handles.hide()
                   }
               }
            }
        }

        const interactionMode = 'click'; // click || hover;

        let events;
        if(interactionMode === 'click') {
            events = 'mousedown touchstart';
            ElementManager(this.root).on(events, (e) => {
                if ( !this.paused  ) {
                    _eventsHandle(e)
                }
         });
        } else if (interactionMode === 'hover') {
            events = 'mousemove touchmove';
            ElementManager(this.root).on(events, (e) => {
                if ( !this.paused && e.pageX % 2 === 0) {
                    _eventsHandle(e)
                }
         });
        }
 
         
    };
}

globalThis.LiveEdit = LiveEdit;

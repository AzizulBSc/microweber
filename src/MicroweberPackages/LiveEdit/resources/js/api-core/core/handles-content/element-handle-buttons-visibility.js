import MicroweberBaseClass from "../../services/containers/base-class";

import {DomService} from "../classes/dom";


export class ElementHandleButtonsVisibility extends MicroweberBaseClass {
    proto = null;

    constructor(proto) {
        super();
        this.proto = proto;


    }



    shouldShowCloneButton(target) {
        const isVisible = this.isPlaceholder(target) && (target.classList.contains('cloneable') || target.classList.contains('mw-col'));
        if (!isVisible) {
            const hasCloneable = DomService.hasAnyOfClasses(target, ['cloneable']);
            if (hasCloneable) {
                return true;
            }
        }
        return isVisible;
    }

    shouldShowMoveBackwardButton(target) {
        const isCloneable = target.classList.contains('cloneable') || target.classList.contains('mw-col');
        const prev = target.previousElementSibling;

        const isVisible = this.isPlaceholder(target) && isCloneable && prev;

        return isVisible;
    }

    shouldShowMoveForwardButton(target) {
        const isCloneable = target.classList.contains('cloneable') || target.classList.contains('mw-col');
        const next = target.nextElementSibling;

        const isVisible = this.isPlaceholder(target) && isCloneable && next;
        return isVisible;
    }

    shouldShowResetImageSizeButton(target) {
        if (target && target.classList && target.classList.contains('mw-resized')) {
            const isImage = target.nodeName === 'IMG' && this.isPlaceholder(target);
            if (isImage) {
                return !target.parentNode.classList.contains('img-as-background');
            }
        }
    }


    shouldShowFitImageButton(target) {
        //has class mw-resized
        if (target && target.classList) {
            const isImage = target.nodeName === 'IMG' && this.isPlaceholder(target);
            if (isImage) {
                return !target.parentNode.classList.contains('img-as-background');
            }
        }
    }


    shouldShowLinkButton(target) {
        const isImageOrLink = target.nodeName === 'IMG' || target.nodeName === 'A';
        if (isImageOrLink && !this.isPlaceholder(target)) {
            return true;
        }
    }

    shouldShowUnlinkButton(target) {
        const isLinkOrParentWithLink = target.nodeName === 'A' || target.parentNode && target.parentNode.nodeName === 'A';
        if (isLinkOrParentWithLink && !this.isPlaceholder(target)) {
            return true;
        }
    }

    shouldShowStyleEditorButton(target) {
        var selfVisible = true;


        const isImageOrLink = target.nodeName === 'IMG' || target.nodeName === 'A';
        if (isImageOrLink && !this.isPlaceholder(target)) {

            selfVisible = false;

        }
        return selfVisible;
    }

    shouldShowBackroundImageEditorButtonOnTheMoreButton(target) {
        var selfVisible = false;
        // element to parent with background image
        const hasBg = DomService.firstParentOrCurrentWithAnyOfClasses(target, ['background-image-holder', 'img-holder']);
        if(hasBg) {
            selfVisible = true;
        }
        return selfVisible;
    }
    shouldShowBackroundImageEditorButton(target) {

        var selfVisible = false;
        // element to parent with background image
        const hasBg = DomService.hasAnyOfClasses(target, ['background-image-holder', 'img-holder']);
        if(hasBg) {
            selfVisible = true;
        }

        return selfVisible;
    }

    shouldShowDragButton(target) {
        var selfVisible = true;
        const isCloneable = target.classList.contains('cloneable') || target.classList.contains('mw-col');
        const isEdit = target.classList.contains('edit');
        if (isCloneable || isEdit) {
            selfVisible = false;
        }

        if (DomService.hasAnyOfClassesOnNodeOrParent(target, ['img-as-background'])) {
            selfVisible = false;
        }
        return selfVisible;
    }

    shouldShowEditButton(target) {
        var selfVisible = true;


        var isCloneable = (target.classList.contains('cloneable') && target.nodeName !== 'IMG');
        if (isCloneable || target.classList.contains('mw-col')) {
            selfVisible = false;
        }

        var newTarget = mw.app.liveEdit.elementHandleContent.settingsTarget.getSettingsTarget(target);
        if (newTarget !== target) {
            selfVisible = true;
        }


        if (target.classList.contains('edit')) {
            if (!!target.innerHTML.trim()) {
                if ((target.getAttribute('field') !== 'title' || target.getAttribute('rel') !== 'title') && !target.classList.contains('plain-text')) {
                    selfVisible = false;
                }
            }
            if (target.querySelector('.module')) {
                selfVisible = false;
            }
        }
        if (target.classList.contains('spacer')) {
            selfVisible = false;
        }
        if (target.classList.contains('no-typing')) {
            selfVisible = false;
        }

        return selfVisible;
    }

    shouldShowInsertModuleButton(target) {
        var selfVisible = true;

        var canDrop = mw.app.liveEdit.elementHandleContent.settingsTarget.canDropInTarget(target);
        if (!canDrop) {
            selfVisible = false;
        }
        return selfVisible;
    }


    shouldShowSettingsButton(target) {
        var selfVisible = true;

        // todo: safe mode for css editor

        const isCloneable = target.classList.contains('cloneable') || target.classList.contains('mw-col');
        if (isCloneable) {
            selfVisible = true;
        }

        if(target.classList.contains('mw-col')) {
            selfVisible = false;
        } else if (target.classList.contains('spacer')) {
            selfVisible = false;
        } else if(this.isPlaceholder(target)) {
            selfVisible = false;
        }

        return selfVisible;
    }

    shouldShowEditBackgroundColorButton(target) {
        var selfVisible = false;


        if (target.classList.contains('background-color-element') ) {
            selfVisible = true;
        }
        return selfVisible;
    }

    shouldShowDeleteElementButton(target) {
        let selfVisible = true;
        if(target.classList.contains('edit')) {
            selfVisible = false;
        }

        if(!DomService.parentsOrCurrentOrderMatchOrOnlyFirst(target.parentNode, ['edit', 'module'])) {
            selfVisible = false;
        }
        return selfVisible;

    }

    isPlaceholder(target) {
        return target.classList.contains('mw-img-placeholder');
    }
}
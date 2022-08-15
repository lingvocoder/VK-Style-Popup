export default class Modal {
    static activeModal;
    timerId;
    element;

    constructor({action = '', link = "", elements = []} = {}) {
        this.actionText = action;
        this.link = link;
        this.animateElements = elements;
        this.render();
        this.initEventListeners();
    }

    render() {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = this.template;
        this.element = wrapper.firstElementChild;
    }

    initEventListeners() {
        document.addEventListener("click", this.onCloseBtnClick);
        document.addEventListener("click", this.handleOpenButtonClick);
    }

    animateElement(element, animationName, cb) {
        const node = document.querySelector(element);
        node.classList.add(`${element.substring(1)}_animated`, animationName);

        function handleAnimationEnd(ev) {
            ev.stopPropagation();
            node.classList.remove(`${element.substring(1)}_animated`, animationName);
            node.removeEventListener('animationend', handleAnimationEnd);

            if (typeof cb === 'function') cb();
        }

        node.addEventListener('animationend', handleAnimationEnd)
    }

    onOpenBtnClick = (ev) => {
        const target = ev.target;
        console.log(target);
        if (!target) return;
        const modalUnderlay = `.${this.animateElements[0].className}`;
        const modal = `.${this.animateElements[1].className}`;
        this.animateElement(modalUnderlay, 'active');
        this.animateElement(modal, 'active');
    };
    
    handleOpenButtonClick = () => {
        const links = [...document.querySelectorAll(".menu__item")];
        links.forEach(link => link.addEventListener('click', this.onOpenBtnClick))
    }

    onCloseBtnClick = (ev) => {
        const target = ev.target;
        const closeBtn = target.closest(".modal__btn_action");
        const modalUnderlay = `.${this.animateElements[0].className}`;
        const modal = `.${this.animateElements[1].className}`;
        if (!closeBtn) return;
        this.animateElement(modalUnderlay, 'inactive', () => this.removeNode(350));
        this.animateElement(modal, 'inactive', () => this.removeNode(350));

    };

    removeNode = (timeout) => {
        setTimeout(this.destroy(), timeout)
    }

    show(parentElement = document.body) {
        if (Modal.activeModal) {
            Modal.activeModal.remove();
        }

        parentElement.append(this.element);
        Modal.activeModal = this;
    }

    get template() {
        return `
    <div class="modal-wrapper" role="dialog">
    <div class="modal-wrapper__inner">
        <div class="modal-underlay"></div>
        <div class="modal">
            <div class="modal__wrapper">
                <img class="" src="./images/qr_code.png" alt="">
                    <button type="button" class="modal__btn modal__btn_action">
                        ${this.getActionText()}
                    </button>
            </div>
        </div>
    </div>
`;
    }

    getActionText() {
        return `
         <span class="modal__btn_text">
                ${this.actionText}      
         </span>
    `;
    }

    getLink() {
        const actionText = this.actionText;
        return this.link
            ? `<span class="modal__text modal__text_action">${actionText}</span>`
            : "";
    }

    remove() {
        clearTimeout(this.timerId);
        if (this.element) {
            this.element.remove();
        }
        return true;
    }

    destroy() {
        this.remove();
        this.element = null;
        Modal.activeModal = null;
        return true;
    }
}
